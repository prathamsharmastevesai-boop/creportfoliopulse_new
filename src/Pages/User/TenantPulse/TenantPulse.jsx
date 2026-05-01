import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProgressBar, Form, Button, Offcanvas } from "react-bootstrap";
import {
  getFollowingCompanies,
  followCompany,
  unfollowCompany,
  getTenantFeed,
} from "../../../Networking/User/APIs/TenantPulse/tenantPulseApi";
import "./tenantPulse.css";
import { Plus, Settings2 } from "lucide-react";
import RAGLoader from "../../../Component/Loader";

export const TenantPulse = () => {
  const dispatch = useDispatch();
  const { following, feed } = useSelector((state) => state.tenantPulseSlice);

  const [newCompany, setNewCompany] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (feed.loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage < feed.total_pages) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          dispatch(getTenantFeed({ page: nextPage, company_name: filterCompany }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [feed.loading, feed.total_pages, currentPage, filterCompany, dispatch]
  );

  useEffect(() => {
    dispatch(getFollowingCompanies());
    dispatch(getTenantFeed({ page: 1 }));
  }, [dispatch]);

  const handleFollow = async (e) => {
    e.preventDefault();
    if (!newCompany.trim()) return;
    try {
      await dispatch(followCompany(newCompany)).unwrap();
      setNewCompany("");
      dispatch(getFollowingCompanies());
    } catch (err) {
      console.error("Failed to follow company:", err);
    }
  };

  const handleUnfollow = async (companyName) => {
    try {
      await dispatch(unfollowCompany(companyName)).unwrap();
      dispatch(getTenantFeed({ page: 1 }));
    } catch (err) {
      console.error("Failed to unfollow company:", err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== filterCompany) {
        setFilterCompany(searchTerm);
        setCurrentPage(1);
        dispatch(getTenantFeed({ page: 1, company_name: searchTerm }));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch, filterCompany]);

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const renderSidebarContent = () => (
    <>
      <div className="tp-add-box">
        <h5 className="mb-3">Follow New Company</h5>
        <div className="tp-limit-info mb-4">
          <span className="tp-limit-text">
            Usage: {following.followed_count} / {following.max_allowed}
          </span>
          <ProgressBar
            now={(following.followed_count / following.max_allowed) * 100}
            className="tp-progress"
          />
        </div>

        <Form onSubmit={handleFollow} className="d-flex gap-2">
          <Form.Control
            className="tp-search-input"
            placeholder="Company name..."
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
          />
          <Button
            type="submit"
            className="tp-btn-follow-icon"
            disabled={
              following.followed_count >= following.max_allowed ||
              following.loading
            }
          >
            <Plus size={20} />
          </Button>
        </Form>
      </div>

      <div className="tp-following-box mt-4">
        <h5 className="mb-3">Companies You Follow</h5>
        {following.loading && following.companies.length === 0 ? (
          <div className="text-center py-4">
            <RAGLoader />
          </div>
        ) : following.companies.length === 0 ? (
          <div className="tp-empty-state-side py-4 text-center">
            <p className="text-muted small">No companies followed yet.</p>
          </div>
        ) : (
          <div className="tp-following-list">
            {following.companies.map((company) => (
              <div key={company.id} className="tp-company-item">
                <span className="tp-company-name">
                  {company.company_name}
                </span>
                <button
                  className="tp-unfollow-btn"
                  onClick={() => handleUnfollow(company.company_name)}
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="container-fluid tp-container">
      <div className="tp-header d-flex justify-content-between align-items-center">
        <h2 className="tp-title">RSS Tenant Feed</h2>
        <Button
          variant="primary"
          className="tp-header-manage-btn d-lg-none"
          onClick={() => setShowMobileSidebar(true)}
          title="Manage Companies"
        >
          <Settings2 size={20} />
        </Button>
      </div>

      <div className="tp-content-grid">
        <div className="tp-main-section">
          <div className="tp-search-container">
            <Form.Control
              className="tp-search-input"
              placeholder="Filter by company name..."
              value={searchTerm}
              onChange={handleFilterChange}
            />
          </div>

          {feed.loading && feed.data.length === 0 ? (
            <div className="text-center py-5">
              <RAGLoader />
              <p className="mt-2 text-muted">Loading feed...</p>
            </div>
          ) : feed.data.length === 0 && !feed.loading ? (
            <div className="tp-empty-state">
              <i className="bi bi-rss tp-empty-icon"></i>
              <h3>No News Found</h3>
              <p>Follow companies to see their latest news here.</p>
            </div>
          ) : (
            <div className="tp-feed-list">
              {feed.data.map((item, index) => {
                const isLast = feed.data.length === index + 1;
                return (
                  <div
                    key={index}
                    ref={isLast ? lastElementRef : null}
                    className={`tp-news-card sentiment-${item.sentiment.toLowerCase()}`}
                  >
                    <div className="tp-news-header">
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tp-news-headline"
                      >
                        {item.headline}
                      </a>
                      <span className="tp-sentiment-badge">
                        {item.sentiment}
                      </span>
                    </div>
                    <div className="tp-news-snippet">
                      {stripHtml(item.snippet)}
                    </div>
                    <div className="tp-news-footer">
                      <div className="tp-news-meta">
                        <span className="tp-news-company">
                          {item.company_name}
                        </span>
                        <span className="tp-news-source">
                          {item.source_name}
                        </span>
                      </div>
                      <div className="tp-news-date">
                        <i className="bi bi-calendar3"></i>
                        {formatDate(item.published_at)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {feed.loading && feed.data.length > 0 && (
                <div className="text-center py-3">
                  <RAGLoader />
                  <p className="mt-2 text-muted small">Loading more...</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="tp-side-section d-none d-lg-block">
          {renderSidebarContent()}
        </div>
      </div>

      <Offcanvas
        show={showMobileSidebar}
        onHide={() => setShowMobileSidebar(false)}
        placement="end"
        className="tp-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Manage Companies</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {renderSidebarContent()}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
