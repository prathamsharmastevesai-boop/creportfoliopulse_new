import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ListuserBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import RAGLoader from "../../../Component/Loader";
import { AppHeader } from "../../../Component/AppHeader/appHeader";
import { toast } from "react-toastify";

const BuildingCard = ({ building, cardRef, onGoToChat }) => {
  const imageUrl = building.photos?.find((p) => p?.url)?.url;

  const actions = [
    { icon: "bi-fire", cat: "fire_safety", label: "Fire & Safety" },
    { icon: "bi-stack", cat: "building_stack", label: "Building Stack" },
    { icon: "bi-info-circle", cat: "building_info", label: "Building Info" },
    { icon: "bi-person-lines-fill", cat: "tenant_info", label: "Tenant Info" },
  ];

  const hasAccess = (cat) => {
    const categories = building.categories || [];
    if (categories.includes("building_info")) {
      if (cat === "building_info" || cat === "building_stack") return true;
    }
    return categories.includes(cat);
  };

  const handleActionClick = (cat, label, allowed) => {
    if (!allowed) {
      toast.error(`Access Denied: ${label}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: "🔒",
      });
      return;
    }
    onGoToChat(building.id, cat);
  };

  const sqft = building?.summary?.total_vacant_sf
    ? Number(building.summary.total_vacant_sf).toLocaleString()
    : building?.total_vacant_sf
      ? Number(building.total_vacant_sf).toLocaleString()
      : "0";

  return (
    <div ref={cardRef} className="npo-card slide-in-top">
      <div className="npo-card__addr-strip">
        <span className="npo-card__addr-text">{building.address || "N/A"}</span>
      </div>

      <div className="npo-card__body">
        <div className="npo-card__img-col">
          <img
            src={imageUrl || "/default_image.jpg"}
            alt={building.address || "Building"}
            className="npo-card__img"
          />
        </div>

        <div className="npo-card__right">
          <div className="npo-card__stats-row">
            <div className="npo-stat-col">
              <span className="npo-stat-lbl">SQUARE FOOTAGE</span>
              <span className="npo-stat-val">{sqft}</span>
            </div>
            <div className="npo-stat-col">
              <span className="npo-stat-lbl">CURRENT TENANT COUNT</span>
              <span className="npo-stat-val">
                {building?.summary?.current_tenant_count ?? "0"}
              </span>
            </div>
            <div className="npo-stat-col">
              <span className="npo-stat-lbl">CURRENT LISTING</span>
              <span className="npo-stat-val">
                {building?.summary?.current_listings_count || "0"}
              </span>
            </div>
            <div className="npo-stat-col">
              <span className="npo-stat-lbl">Total Occupied SF</span>
              <span className="npo-stat-val">
                {building?.summary?.total_occupied_sf || "0"}
              </span>
            </div>
          </div>

          <div className="npo-card__actions">
            {actions.map(({ icon, cat, label }) => {
              const allowed = hasAccess(cat);
              return (
                <button
                  key={cat}
                  className={`npo-action-btn ${!allowed ? "disabled" : ""}`}
                  title={allowed ? label : `Access Denied: ${label}`}
                  onClick={() => handleActionClick(cat, label, allowed)}
                >
                  <i className={`bi ${!allowed ? "bi-lock-fill" : icon}`}></i>
                  <span className="npo-action-label">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardsRef = useRef({});
  const [searchTerm, setSearchTerm] = useState("");

  const { BuildingList, loading } = useSelector((s) => s.BuildingSlice);

  useEffect(() => {
    dispatch(ListuserBuildingSubmit());
  }, [dispatch]);

  const uniqueBuildings = Object.values(
    BuildingList.reduce((acc, curr) => {
      if (!acc[curr.id]) {
        acc[curr.id] = {
          ...curr,
          categories: [curr.category],
        };
      } else {
        acc[curr.id].categories = [
          ...new Set([...acc[curr.id].categories, curr.category]),
        ];

        if (!acc[curr.id].summary && curr.summary) {
          acc[curr.id].summary = curr.summary;
        }

        if (!acc[curr.id].photos?.length && curr.photos?.length) {
          acc[curr.id].photos = curr.photos;
        }
      }

      return acc;
    }, {}),
  );

  const filteredBuildings = uniqueBuildings.filter((b) =>
    b.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    filteredBuildings.forEach((b, i) => {
      const card = cardsRef.current[b.id];
      if (card) setTimeout(() => card.classList.add("visible"), i * 120);
    });
  }, [filteredBuildings]);

  const goToChat = (buildingId, category) => {
    const routes = {
      fire_safety: "/user-fire-safety-building-mechanicals",
      tenant_info: "/tenant-information-chat",
      building_stack: "/user-building-stack-floor",
      default: "/building-chat",
    };
    navigate(routes[category] || routes.default, {
      state: { buildingId, category },
    });
  };

  const first = filteredBuildings[0];
  const occupancy = first?.total_occupancy_pct_all ?? "N/A";
  const vacantSF = first?.total_vacant_sf_all ?? "N/A";

  return (
    <div className="npo-root">
      {/* <AppHeader showHero={true} /> */}

      <div className="npo-topbar">
        <div className="npo-topbar__left">
          <span className="npo-topbar__title">PORTFOLIO OVERVIEW</span>
        </div>
        <div className="npo-search-wrap">
          <i className="bi bi-search npo-search-icon"></i>
          <input
            type="search"
            className="npo-search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="npo-overview-wrap">
        <div className="npo-overview-box">
          <div className="npo-overview__header">
            PORTFOLIO OVERVIEW
            <i className="bi bi-activity npo-overview__pulse-icon"></i>
          </div>
          <div className="npo-overview__body">
            <div className="npo-overview__stat">
              <span className="npo-overview__stat-lbl">
                PORTFOLIO OCCUPANCY
              </span>
              <span className="npo-overview__stat-val">{occupancy}%</span>
            </div>
            <div className="npo-overview__stat">
              <span className="npo-overview__stat-lbl">TOTAL VACANT SF</span>
              <span className="npo-overview__stat-val">{vacantSF}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="npo-list">
        {loading ? (
          <div className="npo-loading">
            <RAGLoader />
            <p className="text-muted mt-2">Loading buildings…</p>
          </div>
        ) : filteredBuildings.length === 0 ? (
          <div className="alert alert-info m-3">
            No buildings found matching your search.
          </div>
        ) : (
          [...filteredBuildings].map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
              cardRef={(el) => (cardsRef.current[building.id] = el)}
              onGoToChat={goToChat}
            />
          ))
        )}
      </div>
    </div>
  );
};
