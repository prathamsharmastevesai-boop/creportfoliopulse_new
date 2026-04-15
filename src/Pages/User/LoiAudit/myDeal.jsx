import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchDealsApi } from "../../../Networking/User/APIs/LoiAudit/loiAuditApi";
import {
  CheckCheck,
  ChevronRight,
  Clock3,
  Layers,
  MessageSquare,
} from "lucide-react";
import { capitalFunction } from "../../../Component/capitalLetter";

export const MyDeals = ({ onDealClick }) => {
  const [deals, setDeals] = useState([]);
  console.log(deals, "deals");

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const data = await dispatch(fetchDealsApi()).unwrap();
      setDeals(data?.deals || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const stats = [
    {
      label: "Total Deals",
      value: deals.length,
      icon: <Layers size={16} />,
      cls: "loi-stat--accent",
    },
    {
      label: "Awaiting Counter",
      value: deals.filter((d) => d.status === "awaiting_counter").length,
      icon: <Clock3 size={16} />,
      cls: "loi-stat--mid",
    },
    {
      label: "Counter Received",
      value: deals.filter((d) => d.status === "counter_received").length,
      icon: <MessageSquare size={16} />,
      cls: "loi-stat--hover",
    },
    {
      label: "Executed",
      value: deals.filter((d) => d.status === "executed").length,
      icon: <CheckCheck size={16} />,
      cls: "loi-stat--green",
    },
  ];

  const mappedDeals = deals.map((d) => {
    let tag = "";
    let tagCls = "";
    let borderCls = "";

    switch (d.status) {
      case "awaiting_counter":
        tag = "Awaiting Counter";
        tagCls = "loi-tag--mid";
        borderCls = "loi-deal-border--mid";
        break;
      case "counter_received":
        tag = "Counter Received";
        tagCls = "loi-tag--hover";
        borderCls = "loi-deal-border--hover";
        break;
      case "executed":
        tag = "Executed";
        tagCls = "loi-tag--green";
        borderCls = "loi-deal-border--green";
        break;
      default:
        tag = "Draft";
        tagCls = "";
        borderCls = "";
    }

    return {
      id: d.id,
      name: d.tenant_name,
      address: `${d.building} · ${d.floor_suite} · ${d.rsf} RSF`,
      update: d.updated_at
        ? `Last update: ${new Date(d.updated_at).toDateString()}`
        : "",
      tag,
      tagCls,
      borderCls,
      raw: d,
    };
  });

  return (
    <div className="loi-tab-content">
      <div className="row g-3 mb-3">
        {stats.map((s) => (
          <div key={s.label} className="col-6 col-sm-3">
            <div className={`loi-stat-card ${s.cls}`}>
              <div className="loi-stat-icon">{s.icon}</div>
              <div className="loi-stat-val">{s.value}</div>
              <div className="loi-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="loi-section-header d-flex align-items-center gap-2 mb-2">
        <Layers size={11} />
        MY ACTIVE DEALS
      </div>

      <div className="d-flex flex-column gap-2 mb-3">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : mappedDeals.length === 0 ? (
          <div className="text-center">No Deals Found</div>
        ) : (
          mappedDeals.map((d) => (
            <div
              key={d.id}
              className={`loi-deal-row ${d.borderCls}`}
              style={{ cursor: "pointer" }}
              onClick={() => onDealClick({ raw: d.raw })}
            >
              <div className="flex-grow-1 overflow-hidden">
                <div className="loi-deal-name">{capitalFunction(d.name)}</div>
                <div className="loi-deal-addr">{d.address}</div>
                {d.update && <div className="loi-deal-update">{d.update}</div>}
              </div>

              <div className="d-flex flex-column align-items-end gap-1 ms-2">
                <span className={`loi-tag ${d.tagCls}`}>{d.tag}</span>
                <span className="loi-hint d-flex align-items-center gap-1">
                  View Deal <ChevronRight size={10} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
