import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RAGLoader from "./Loader";
import "bootstrap-icons/font/bootstrap-icons.css";

export const BuildingList = ({
  title = "Building List",
  fetchAction,
  selector,
  category,
  searchKey = "address",
  navigateTo,
  navigateStateMapper,
  renderItem,
  subscriptions = [],
  onSubscribe,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardsRef = useRef({});

  const [loadingBell, setLoadingBell] = useState(null);

  const handleBellClick = async (buildingId) => {
    if (!onSubscribe) return;

    setLoadingBell(buildingId);
    try {
      await onSubscribe(buildingId);
    } finally {
      setLoadingBell(null);
    }
  };

  const { data = [], loading } = useSelector(selector);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (fetchAction) {
      dispatch(fetchAction(category));
    }
  }, [dispatch, fetchAction, category]);

  const filteredData =
    searchTerm.trim() === ""
      ? data
      : data.filter((item) =>
          item?.[searchKey]?.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  useEffect(() => {
    filteredData.forEach((item, i) => {
      const card = cardsRef.current[item.id];
      if (card) {
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 150);
      }
    });
  }, [filteredData]);

  const handleNavigate = (item) => {
    navigate(navigateTo, {
      state: navigateStateMapper ? navigateStateMapper(item) : {},
    });
  };

  const isSubscribed = (buildingId) => {
    const sub = subscriptions?.find(
      (s) => s.building_id === buildingId && s.section === "Maintenance",
    );
    return sub?.app_enabled === true;
  };

  return (
    <>
      <div className="header-bg d-flex justify-content-start px-3 align-items-center sticky-header">
        <h4 className="mb-0 text-light mx-4">{title}</h4>
      </div>

      <div className="container-fluid p-3">
        <input
          type="search"
          className="form-control"
          placeholder={`Search by ${searchKey}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="container-fluid p-3">
        {loading ? (
          <div className="text-center py-5">
            <RAGLoader />
            <p className="mt-3 text-muted">Loading...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="alert alert-info">No data found.</div>
        ) : (
          <div className="row">
            {[...filteredData].reverse().map((item) => {
              const subscribed = isSubscribed(item.id);

              return (
                <div className="col-12 mb-3" key={item.id}>
                  <div
                    ref={(el) => (cardsRef.current[item.id] = el)}
                    className="card border-0 shadow-sm slide-in-top p-3"
                    style={{ borderRadius: "16px" }}
                  >
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <div className="d-flex justify-content-between align-items-center">
                        <div
                          className="d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleNavigate(item)}
                        >
                          <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                          <div>{item?.[searchKey] || "N/A"}</div>
                        </div>
                        {category === "maintenance" && (
                          <i
                            className={`bi ${
                              loadingBell === item.id
                                ? "bi-arrow-repeat spin"
                                : subscribed
                                  ? "bi-bell-fill text-warning"
                                  : "bi-bell text-secondary"
                            }`}
                            style={{ fontSize: "1.5rem", cursor: "pointer" }}
                            onClick={() => handleBellClick(item.id)}
                          ></i>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
