import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  itcalculatorApi,
  saveTemplate,
  loadTemplates,
  deleteTemplate,
} from "../../../Networking/User/APIs/Calculator/calcApi";

const LINE_ITEMS = [
  { name: "Demolition", pct: 100, defaultPrice: 0 },
  { name: "New HVAC System", pct: 100, defaultPrice: 0 },
  { name: "Painting", pct: 100, defaultPrice: 0 },
  { name: "Lighting", pct: 100, defaultPrice: 0 },
  { name: "Plumbing", pct: 100, defaultPrice: 0 },
  { name: "Carpeting", pct: 75, defaultPrice: 0 },
  { name: "Glass Front Offices", pct: 12, defaultPrice: 0 },
  { name: "Pantry Remodel", pct: 6, defaultPrice: 0 },
  { name: "Bathroom Remodel", pct: 8, defaultPrice: 0 },
  { name: "Tile (Stone/Ceramic)", pct: 10, defaultPrice: 0 },
  { name: "Hardwood Polishing", pct: 5, defaultPrice: 0 },
];

const fmt = (v, d = 0) =>
  Number(v || 0).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

export const TICalculator = () => {
  const dispatch = useDispatch();

  const [sf, setSf] = useState("");
  const [checkedItems, setCheckedItems] = useState(
    Object.fromEntries(LINE_ITEMS.map((it) => [it.name, true])),
  );
  const [customPrices, setCustomPrices] = useState(
    Object.fromEntries(LINE_ITEMS.map((it) => [it.name, it.defaultPrice])),
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { templates } = useSelector((state) => state.tiCalculatorSlice);
  const [selectedTplIndex, setSelectedTplIndex] = useState("");
  const [tplNameInput, setTplNameInput] = useState("");
  const [tplLoading, setTplLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(loadTemplates());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFormula = useCallback(
    (item) => {
      const price = customPrices[item.name] ?? item.defaultPrice;
      return `${fmt(sf)} SF × ${item.pct}% × $${Number(price).toFixed(1)}/SF`;
    },
    [sf, customPrices],
  );

  const handleCheckbox = (name) =>
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));

  const handlePriceChange = (name, val) =>
    setCustomPrices((prev) => ({ ...prev, [name]: val }));

  const handleCalculate = async () => {
    const selectedNames = LINE_ITEMS.filter((it) => checkedItems[it.name]).map(
      (it) => it.name,
    );
    if (!sf || Number(sf) <= 0 || selectedNames.length === 0) return;

    setLoading(true);
    try {
      const payload = {
        sf: Number(sf),
        items: selectedNames,
        custom_prices: Object.fromEntries(
          selectedNames.map((name) => [name, Number(customPrices[name])]),
        ),
      };

      const response = await dispatch(itcalculatorApi(payload));
      if (response.meta?.requestStatus === "fulfilled") {
        setResult(response.payload);
      } else {
        alert("Calculation failed. Please try again.");
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (tpl) => {
    if (tpl.sf) setSf(tpl.sf);

    if (tpl.custom_prices) {
      setCustomPrices(
        Object.fromEntries(
          LINE_ITEMS.map((it) => [
            it.name,
            tpl.custom_prices[it.name] ?? it.defaultPrice,
          ]),
        ),
      );

      const savedNames = Object.keys(tpl.custom_prices);
      setCheckedItems(
        Object.fromEntries(
          LINE_ITEMS.map((it) => [it.name, savedNames.includes(it.name)]),
        ),
      );
    }

    setResult(null);
  };

  const handleSaveTemplate = async () => {
    const name = tplNameInput.trim();
    if (!name) return;

    setTplLoading(true);
    try {
      const res = await dispatch(
        saveTemplate({
          building_name: name,
          sf: Number(sf),
          custom_prices: Object.fromEntries(
            LINE_ITEMS.filter((it) => checkedItems[it.name]).map((it) => [
              it.name,
              Number(customPrices[it.name]),
            ]),
          ),
        }),
      );

      if (res.meta?.requestStatus === "fulfilled") {
        setTplNameInput("");
        resetForm();
      }
    } catch (err) {
      console.error("Save template error:", err);
    } finally {
      setTplLoading(false);
    }
  };

  const resetForm = () => {
    setSf(5000);
    setCheckedItems(Object.fromEntries(LINE_ITEMS.map((it) => [it.name, true])));
    setCustomPrices(
      Object.fromEntries(LINE_ITEMS.map((it) => [it.name, it.defaultPrice])),
    );
    setResult(null);
    setSelectedTplIndex("");
  };

  const handleDeleteTemplate = async (id) => {
    const targetId = id || (templates[parseInt(selectedTplIndex)]?.id);
    if (!targetId) return;

    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      const res = await dispatch(deleteTemplate(targetId));
      if (res.meta?.requestStatus === "fulfilled") {
        if (!id) setSelectedTplIndex("");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="tic-wrap">
      <div className="tic-top-bar">
        <div className="tic-top-field">
          <div className="tic-field-label">Select saved building template</div>
          <div className="tic-custom-dropdown" ref={dropdownRef}>
            <div
              className="tic-dropdown-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>
                {selectedTplIndex !== ""
                  ? templates[selectedTplIndex]?.building_name
                  : "— select a template —"}
              </span>
              <i
                className={`bi ${showDropdown ? "bi-chevron-up" : "bi-chevron-down"}`}
              ></i>
            </div>
            {showDropdown && (
              <div className="tic-dropdown-menu">
                <div
                  className="tic-dropdown-item"
                  onClick={() => {
                    resetForm();
                    setShowDropdown(false);
                  }}
                >
                  — select a template —
                </div>
                {templates.map((t, i) => (
                  <div key={t.id ?? i} className="tic-dropdown-item">
                    <span
                      className="tic-item-name"
                      onClick={() => {
                        setSelectedTplIndex(i);
                        applyTemplate(t);
                        setShowDropdown(false);
                      }}
                    >
                      {t.building_name}
                    </span>
                    <button
                      className="tic-item-del-btn"
                      title="Delete Template"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(t.id);
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="tic-top-field">
          <div className="tic-field-label">Save as new template</div>
          <div className="tic-btn-row">
            <input
              type="text"
              className={`tic-input tic-input-flex`}
              placeholder="Building Address / Name…"
              value={tplNameInput}
              onChange={(e) => setTplNameInput(e.target.value)}
            />
            <button
              className="tic-btn-save"
              onClick={handleSaveTemplate}
              disabled={tplLoading || !tplNameInput.trim()}
            >
              {tplLoading ? "Saving…" : "Save template"}
            </button>
          </div>
        </div>
      </div>

      <div className="tic-sf-row">
        <span className="tic-sf-label">Square footage</span>
        <input
          type="number"
          className="tic-sf-input"
          value={sf}
          min={1}
          onChange={(e) => setSf(e.target.value)}
        />
        <span className="tic-sf-unit">SF</span>
      </div>

      <div className="tic-breakdown-list">
        {LINE_ITEMS.map((item) => {
          const checked = !!checkedItems[item.name];
          return (
            <div
              key={item.name}
              className={`tic-bk-row${checked ? "" : " tic-bk-row--dimmed"}`}
            >
              <div>
                <div className="tic-checkbox-wrap">
                  <input
                    type="checkbox"
                    className="tic-checkbox"
                    checked={checked}
                    onChange={() => handleCheckbox(item.name)}
                  />
                  <span className="tic-bk-name">{item.name}</span>
                </div>
                <div className="tic-bk-formula">{getFormula(item)}</div>
              </div>
              <div className="tic-price-wrap">
                <input
                  type="number"
                  className="tic-price-box"
                  value={customPrices[item.name] ?? item.defaultPrice}
                  step={0.5}
                  min={0}
                  onChange={(e) => handlePriceChange(item.name, e.target.value)}
                />
                <span className="tic-price-sf">$/SF</span>
              </div>
            </div>
          );
        })}
      </div>


      {result && (
        <div className="tic-totals-section">
          {Object.entries(result.breakdown || {}).map(([key, val]) => (
            <div key={key} className="tic-total-row">
              <div>
                <span className="tic-total-row-name">{key}</span>
                {val.formula && (
                  <div className="tic-bk-formula">{val.formula}</div>
                )}
              </div>
              <span className="tic-total-val">${fmt(val.cost)}</span>
            </div>
          ))}
          <div className="tic-total-row">
            <span>Contingency (10%)</span>
            <span className="tic-total-val">${fmt(result.contingency)}</span>
          </div>
          <div className="tic-grand-row">
            <span>Estimated total</span>
            <span className="tic-grand-val">
              ${fmt(result.estimated_total)}
            </span>
          </div>
          <div className="tic-psf">
            Cost per SF: ${fmt(result.cost_per_sf, 2)}
          </div>
        </div>
      )}

      <button
        className="tic-recalc-btn"
        onClick={handleCalculate}
        disabled={loading}
      >
        {loading ? "Calculating…" : "Recalculate"}
      </button>
    </div>
  );
};
