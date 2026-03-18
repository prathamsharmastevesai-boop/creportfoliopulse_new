import React from "react";

export const SummaryBar = ({
  totalRSF,
  totalOccupied,
  totalVacant,
  occupancy,
}) => (
  <footer className="bs-summary">
    <span className="bs-summary__label">BUILDING SUMMARY</span>

    <div className="bs-summary__stats d-flex flex-wrap align-items-center">
      <span>
        <b>TOTAL RSF:</b> {totalRSF.toLocaleString()} SF
      </span>
      <span className="bs-summary__divider d-none d-sm-inline">|</span>
      <span>
        <b>OCCUPIED:</b> {totalOccupied.toLocaleString()} SF
      </span>
      <span className="bs-summary__divider d-none d-sm-inline">|</span>
      <span>
        <b>VACANT:</b> {totalVacant.toLocaleString()} SF
      </span>
      <span className="bs-summary__divider d-none d-sm-inline">|</span>
      <span>
        <b>OCCUPANCY:</b> {occupancy}%
      </span>
    </div>
  </footer>
);
