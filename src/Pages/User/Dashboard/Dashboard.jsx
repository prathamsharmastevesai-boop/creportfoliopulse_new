import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ListBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import RAGLoader from "../../../Component/Loader";

const DonutCircle = ({ occupancy = 0 }) => {
  const pct = Math.min(Math.max(occupancy, 0), 100);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const getColor = () =>
    pct > 80
      ? "var(--donut-high)"
      : pct > 50
        ? "var(--donut-mid)"
        : "var(--donut-low)";

  const color = getColor();

  return (
    <div className="po-donut-wrap">
      <svg width="68" height="68" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          stroke="var(--po-donut-track)"
          strokeWidth="6"
        />
        <circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="po-donut-label" style={{ color }}>
        {pct}%
      </div>
    </div>
  );
};

const Sparkline = ({ colorVar }) => (
  <svg width="72" height="20" className="po-sparkline">
    <polyline
      points="0,16 10,12 20,14 30,8 40,10 50,5 60,7 70,2"
      fill="none"
      stroke={colorVar}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const StatCard = ({ label, value, colorVar }) => (
  <div className="po-stat-card">
    <span className="po-stat-label">{label}</span>
    <div className="po-stat-bottom">
      <span className="po-stat-value">{value}</span>
      <Sparkline colorVar={colorVar} />
    </div>
  </div>
);

const BuildingCard = ({ building, cardRef, onGoToChat }) => {
  const imageUrl = building.photos?.find((p) => p?.url)?.url;

  const occupancy = building.current_occupancy || 0;

  const actions = [
    {
      icon: "bi-image",
      cat: "floor_plan",
      title: "Plans / Photos / Flyers",
      label: "Plans / Photos / Flyers",
    },
    {
      icon: "bi-stack",
      cat: "building_stack",
      title: "Building Stack",
      label: "Building Stack",
    },
    {
      icon: "bi-info-circle",
      cat: "building_info",
      title: "Building Info",
      label: "Building Info",
    },
    {
      icon: "bi-list-ul",
      cat: "tenant_info",
      title: "Tenant Info",
      label: "Tenant Info",
    },
  ];

  return (
    <div ref={cardRef} className="po-card slide-in-top">
      <div className="po-card__left">
        {imageUrl ? (
          <img src={imageUrl} alt="building" className="po-card__img" />
        ) : (
          <img
            src="../../../../public/default_image.jpg"
            alt="building"
            className="po-card__img"
          />
        )}

        <div className="po-card__address">{building.address || "N/A"}</div>
      </div>
      <div className="po-card__right">
        <div className="po-card__top">
          <DonutCircle occupancy={occupancy} />
          <div className="po-card__meta">
            <div className="po-card__rows">
              <span className="po-card__key">SQUARE FOOTAGE</span>
              <span className="po-card__val">
                {building?.total_vacant_sf
                  ? Number(building?.summary?.total_vacant_sf).toLocaleString()
                  : "0"}
              </span>
            </div>
            <div className="po-card__rows">
              <span className="po-card__key">CURRECT TENANT COUNT</span>
              <span className="po-card__val">
                {building?.summary?.current_listings_count ?? "0"}
              </span>
            </div>
            <div className="po-card__rows">
              <span className="po-card__key">CURRENT LISTIING COUNTWANG</span>
              <span className="po-card__val">
                {building?.lease_term || "0"}
              </span>
            </div>
          </div>
        </div>
        <div className="po-card__actions">
          {actions.map(({ icon, cat, title, label }) => (
            <button
              key={cat}
              className="po-action-btn"
              title={title}
              onClick={() => onGoToChat(building.id, cat)}
            >
              <i className={`bi ${icon}`}></i>
              <span className="po-action-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companyName = sessionStorage.getItem("company_name");
  const cardsRef = useRef({});
  const [searchTerm, setSearchTerm] = useState("");
  const { BuildingList, loading } = useSelector((state) => state.BuildingSlice);

  useEffect(() => {
    dispatch(ListBuildingSubmit("BuildingInfo"));
  }, [dispatch]);

  const filteredBuildings = BuildingList.filter((b) =>
    b.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    filteredBuildings.forEach((b, i) => {
      const card = cardsRef.current[b.id];
      if (card) setTimeout(() => card.classList.add("visible"), i * 120);
    });
  }, [filteredBuildings]);

  const avgOccupancy = filteredBuildings.length
    ? Math.round(
        filteredBuildings.reduce(
          (sum, b) => sum + (b.current_occupancy || 0),
          0,
        ) / filteredBuildings.length,
      )
    : 0;

  const goToChat = (buildingId, category) => {
    const routes = {
      tenant_info: "/tenant-information-chat",
      building_stack: "/user-building-stack-floor",
      default: "/building-chat",
    };
    navigate(routes[category] || routes.default, {
      state: { buildingId, category },
    });
  };

  return (
    <div className="po-root">
      <section className="hero-section d-flex align-items-center justify-content-center text-center border-bottom">
        <h1 className="fw-bold text-white animate__fadeInUp">
          Welcome to {companyName} AI
        </h1>
      </section>

      <div className="po-header">
        <h1 className="po-title">Portfolio Overview</h1>

        <div className="po-search-wrap">
          <i className="bi bi-search po-search-icon"></i>
          <input
            type="search"
            className="po-search"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="po-stats-row">
          <StatCard
            label="PORTFOLIO OCCUPANCY:"
            value={`${filteredBuildings[0]?.total_occupancy_pct_all || "N/A"}%`}
            colorVar="var(--donut-high)"
          />
          <StatCard
            label="TOTAL VACANT SF:"
            value={`${filteredBuildings[0]?.total_vacant_sf_all || "N/A"}-SF`}
            colorVar="var(--accent-color)"
          />
        </div>

        <div className="po-filter-row">
          <button className="po-filter-btn">Building Info</button>
        </div>
      </div>

      <div className="po-list">
        {loading ? (
          <div className="po-loading">
            <RAGLoader />
            <p className="text-muted mt-2">Loading buildings...</p>
          </div>
        ) : filteredBuildings.length === 0 ? (
          <div className="alert alert-info m-3">
            No buildings found matching your search.
          </div>
        ) : (
          [...filteredBuildings]
            .reverse()
            .map((building) => (
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
