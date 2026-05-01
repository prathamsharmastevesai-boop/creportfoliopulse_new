import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getdistilledCompTrackerlistApi, deleteDCTComp } from "../../../Networking/Admin/APIs/distilledCompTrackerApi";
import { toast } from "react-toastify";
import RAGLoader from "../../../Component/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../../../Component/confirmDeleteModal";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export const DistilledCompTrackerList = ({ chat }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [submarketFilter, setSubmarketFilter] = useState("");
  const [termFilter, setTermFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, submarketFilter, termFilter, pageSize]);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.address_anon?.toLowerCase().includes(search.toLowerCase()) ||
      item.submarket?.toLowerCase().includes(search.toLowerCase());
    const matchesSubmarket = submarketFilter
      ? item.submarket === submarketFilter
      : true;
    const matchesTerm = termFilter
      ? String(item.term_months) === termFilter
      : true;
    return matchesSearch && matchesSubmarket && matchesTerm;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = filteredData.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  useEffect(() => {
    fetchComps();
  }, []);

  const fetchComps = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getdistilledCompTrackerlistApi(),
      ).unwrap();
      setData(response || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handlechat = () => {
    navigate("/dct-chat", { state: { category: "DCT" } });
  };

  const handleEdit = (id) => {
    navigate(`/distilled-comp-tracker-form/${id}`);
  };

  const handleDelete = (comp) => {
    setSelectedComp(comp);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedComp) return;
    const id = selectedComp.id || selectedComp._id;
    try {
      setDeleteLoadingId(id);
      await dispatch(deleteDCTComp(id)).unwrap();

      setShowDeleteModal(false);
      setSelectedComp(null);
      fetchComps();
    } catch (err) {
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const goTo = (page) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(1, safePage - delta);
    const right = Math.min(totalPages, safePage + delta);
    for (let i = left; i <= right; i++) range.push(i);

    const withEllipsis = [];
    if (left > 1) {
      withEllipsis.push(1);
      if (left > 2) withEllipsis.push("...");
    }
    withEllipsis.push(...range);
    if (right < totalPages) {
      if (right < totalPages - 1) withEllipsis.push("...");
      withEllipsis.push(totalPages);
    }
    return withEllipsis;
  };

  if (loading)
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center py-5">
        <RAGLoader />
      </div>
    );

  return (
    <div>
      <div className="row align-items-center mb-3 g-2">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search address / submarket"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-6">
          <div className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
            <select
              className="form-select form-select-sm"
              value={submarketFilter}
              onChange={(e) => setSubmarketFilter(e.target.value)}
            >
              <option value="">All Submarkets</option>
              {[...new Set(data.map((d) => d.submarket))].map(
                (sub, i) =>
                  sub && (
                    <option key={i} value={sub}>
                      {sub}
                    </option>
                  ),
              )}
            </select>

            <select
              className="form-select form-select-sm"
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
            >
              <option value="">All Terms</option>
              {[...new Set(data.map((d) => d.term_months))].map(
                (term, i) =>
                  term && (
                    <option key={i} value={term}>
                      {term} Months
                    </option>
                  ),
              )}
            </select>
            {chat == false ? (
              ""
            ) : (
              <button
                className="btn btn-sm btn-secondary d-flex align-items-center justify-content-center gap-1"
                onClick={handlechat}
              >
                <i className="bi bi-chat-dots" />
                Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-4 text-muted">No records found</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Address</th>
                  <th>Submarket</th>
                  <th>Terms Months</th>
                  <th>SF Rounded</th>
                  <th>TI Allowance PSF</th>
                  <th>Free Rent Months</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{(safePage - 1) * pageSize + index + 1}</td>
                    <td>{item.address_anon || "-"}</td>
                    <td>{item.submarket || "-"}</td>
                    <td>{item.term_months || "-"}</td>
                    <td>{item.sf_rounded || "-"}</td>
                    <td>{item.ti_allowance_psf || "-"}</td>
                    <td>{item.free_rent_months || "-"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(item.id || item._id)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item)}
                          disabled={deleteLoadingId === (item.id || item._id)}
                          title="Delete"
                        >
                          {deleteLoadingId === (item.id || item._id) ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <i className="bi bi-trash" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dct-pagination-bar">
            <div className="dct-pagination-info">
              <span>
                {filteredData.length === 0
                  ? "0 records"
                  : `${(safePage - 1) * pageSize + 1}–${Math.min(
                    safePage * pageSize,
                    filteredData.length,
                  )} of ${filteredData.length}`}
              </span>
              <select
                className="dct-page-size-select"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>

            {totalPages > 1 && (
              <div className="dct-pagination-controls">
                <button
                  className="dct-page-btn"
                  onClick={() => goTo(1)}
                  disabled={safePage === 1}
                  aria-label="First page"
                >
                  «
                </button>

                <button
                  className="dct-page-btn"
                  onClick={() => goTo(safePage - 1)}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="dct-page-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`dct-page-btn ${safePage === p ? "active" : ""}`}
                      onClick={() => goTo(p)}
                      aria-current={safePage === p ? "page" : undefined}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  className="dct-page-btn"
                  onClick={() => goTo(safePage + 1)}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                >
                  ›
                </button>

                <button
                  className="dct-page-btn"
                  onClick={() => goTo(totalPages)}
                  disabled={safePage === totalPages}
                  aria-label="Last page"
                >
                  »
                </button>
              </div>
            )}
          </div>
        </>
      )}
      <ConfirmDeleteModal
        show={showDeleteModal}
        selectedEmail={selectedComp?.address_anon || "this comp"}
        deleteLoading={deleteLoadingId !== null}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedComp(null);
        }}
        onDelete={confirmDelete}
      />
    </div>
  );
};
