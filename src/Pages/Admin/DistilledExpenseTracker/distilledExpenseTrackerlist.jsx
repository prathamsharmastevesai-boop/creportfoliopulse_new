import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getdistilledExpenseTrackerlistApi } from "../../../Networking/Admin/APIs/distilledExpenseTrackerApi";
import RAGLoader from "../../../Component/Loader";
import Pagination from "../../../Component/pagination";

export const DistilledExpenseTrackerlist = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    dispatch(getdistilledExpenseTrackerlistApi())
      .unwrap()
      .then((res) => {
        setData(res.reverse());
        setLoading(false);
      })
      .catch((err) => {
        setError(err || "Failed to fetch data");
        setLoading(false);
      });
  }, [dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return `$${Number(value).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <RAGLoader />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-4">{error}</div>;
  }

  return (
    <div className="container-fluid p-3 pt-0">
      {data.length > 0 ? (
        <>
          <div
            className="table-responsive"
            style={{ maxHeight: "70vh", overflow: "auto" }}
          >
            <Table striped bordered hover size="sm" className="mb-0">
              <thead
                className="bg-light"
                style={{ position: "sticky", top: 0, zIndex: 10 }}
              >
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Submarket</th>
                  <th>Building SF</th>
                  <th>Class</th>
                  <th>Real Estate Taxes</th>
                  <th>Property Insurance</th>
                  <th>Electric</th>
                  <th>Gas</th>
                  <th>Water</th>
                  <th>Janitorial</th>
                  <th>Property Mgmt</th>
                  <th>Lobby Security</th>
                  <th>Security Monitoring</th>
                  <th>Accounting</th>
                  <th>Legal</th>
                  {/* <th>TI Allowances</th> */}
                  <th>Commissions</th>
                  <th>Interest Rates</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td>{item.submarket_geo || "-"}</td>
                    <td>{item.building_sf_band || "-"}</td>
                    <td>{item.building_class || "-"}</td>
                    <td className="text-end">
                      {formatCurrency(item.realestate_taxes_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.property_insurance_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.electric_psf)}
                    </td>
                    <td className="text-end">{formatCurrency(item.gas_psf)}</td>
                    <td className="text-end">
                      {formatCurrency(item.water_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.janitorial_cleaning_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.property_mgmt_fees_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.lobby_security_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.security_monitoring_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.accounting_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.legal_psf)}
                    </td>
                    {/* <td className="text-end">
                      {formatCurrency(item.ti_allowances_psf)}
                    </td> */}
                    <td className="text-end">
                      {formatCurrency(item.commissions_psf)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.interest_rates_psf)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="mt-3">
            <Pagination
              totalItems={data.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <p>No submissions found.</p>
        </div>
      )}
    </div>
  );
};
