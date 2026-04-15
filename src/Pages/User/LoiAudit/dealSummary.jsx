import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CheckCheck,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchSummaryApi } from "../../../Networking/User/APIs/LoiAudit/loiAuditApi";
import Card from "../../../Component/Card/Card";
import { toast } from "react-toastify";

export const DealSummary = ({ dealId }) => {
  const dispatch = useDispatch();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dealId) return;
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await dispatch(fetchSummaryApi(dealId)).unwrap();

        if (!data?.available && data?.message) {
          toast.info(data.message);
        }

        if (
          data?.available &&
          data?.landlord_counter_pending &&
          data?.landlord_counter_message
        ) {
          toast.info(data.landlord_counter_message);
        }

        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [dealId]);

  const tenantAsk = summary?.tenant_ask || {};
  const llCounter = summary?.landlord_counter || {};
  const gaps = summary?.delta || {};
  const timeline = summary?.timeline || [];

  const tenantRows = [
    {
      label: "Base Rent (PSF)",
      value: tenantAsk.rent_psf != null ? `$${tenantAsk.rent_psf}/psf` : "—",
    },
    {
      label: "Annual Cost",
      value:
        tenantAsk.annual_cost != null
          ? `$${tenantAsk.annual_cost.toLocaleString()}`
          : "—",
    },
    {
      label: "Free Rent",
      value:
        tenantAsk.free_rent_months != null
          ? `${tenantAsk.free_rent_months} months`
          : "—",
    },
    {
      label: "Escalation",
      value:
        tenantAsk.escalation_pct != null ? `${tenantAsk.escalation_pct}%` : "—",
    },
    {
      label: "Lease Term",
      value:
        tenantAsk.lease_term_years != null
          ? `${tenantAsk.lease_term_years} yrs`
          : "—",
    },
    {
      label: "TI Allowance",
      value: tenantAsk.ti_psf != null ? `$${tenantAsk.ti_psf}/psf` : "—",
    },
    { label: "NER", value: tenantAsk.ner != null ? `$${tenantAsk.ner}` : "—" },
    {
      label: "10-Yr Cost",
      value:
        tenantAsk.ten_yr_cost != null
          ? `$${tenantAsk.ten_yr_cost.toLocaleString()}`
          : "—",
    },
  ];

  const counterRows = [
    {
      label: "Base Rent (PSF)",
      value: llCounter.rent_psf != null ? `$${llCounter.rent_psf}/psf` : "—",
    },
    {
      label: "Annual Cost",
      value:
        llCounter.annual_cost != null
          ? `$${llCounter.annual_cost.toLocaleString()}`
          : "—",
    },
    {
      label: "Free Rent",
      value:
        llCounter.free_rent_months != null
          ? `${llCounter.free_rent_months} months`
          : "—",
    },
    {
      label: "Escalation",
      value:
        llCounter.escalation_pct != null ? `${llCounter.escalation_pct}%` : "—",
    },
    {
      label: "Lease Term",
      value:
        llCounter.lease_term_years != null
          ? `${llCounter.lease_term_years} yrs`
          : "—",
    },
    {
      label: "TI Allowance",
      value: llCounter.ti_psf != null ? `$${llCounter.ti_psf}/psf` : "—",
    },
    { label: "NER", value: llCounter.ner != null ? `$${llCounter.ner}` : "—" },
    {
      label: "10-Yr Cost",
      value:
        llCounter.ten_yr_cost != null
          ? `$${llCounter.ten_yr_cost.toLocaleString()}`
          : "—",
    },
  ];

  const gapRows = [
    {
      label: "Rent Gap",
      value: gaps.rent_gap != null ? `$${gaps.rent_gap}/psf` : "—",
    },
    {
      label: "Free Rent Gap",
      value: gaps.fr_gap != null ? `${gaps.fr_gap} months` : "—",
    },
    {
      label: "NER Gap",
      value: gaps.ner_gap != null ? `$${gaps.ner_gap}` : "—",
    },
    {
      label: "Annual Cost Diff",
      value:
        gaps.annual_cost_diff != null
          ? `$${gaps.annual_cost_diff.toLocaleString()}`
          : "—",
    },
  ];

  if (loading) {
    return (
      <div className="loi-tab-content text-center">Loading summary...</div>
    );
  }

  return (
    <div className="loi-tab-content">
      <div className="loi-section-header d-flex align-items-center flex-wrap gap-2 mb-3">
        <BarChart3 size={13} />
        DEAL ECONOMICS — DEAL #{dealId}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6">
          <Card
            className="loi-compare-card loi-compare-card--accent h-100"
            noPadding
          >
            <div className="loi-compare-title loi-text-accent mb-2">
              Your Ask (V1)
            </div>
            {tenantRows.map((r) => (
              <div key={r.label} className="loi-term-row">
                <span className="loi-term-label">{r.label}</span>
                <span className="loi-term-val loi-text-primary">{r.value}</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="col-12 col-sm-6">
          <Card
            className="loi-compare-card loi-compare-card--green h-100"
            noPadding
          >
            <div className="loi-compare-title loi-text-green-primary mb-2">
              Landlord Counter (V2)
            </div>
            {summary?.landlord_counter_pending ? (
              <div className="loi-hint">Awaiting landlord counter...</div>
            ) : (
              counterRows.map((r) => (
                <div key={r.label} className="loi-term-row">
                  <span className="loi-term-label">{r.label}</span>
                  <span className="loi-term-val loi-text-low">{r.value}</span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      <div className="loi-box mb-3">
        <div className="loi-box-title d-flex align-items-center gap-2 mb-3">
          <TrendingUp size={11} /> Gap Analysis
        </div>
        {summary?.landlord_counter_pending ? (
          <div className="loi-hint">
            Gap analysis will be available once landlord counter is drafted.
          </div>
        ) : (
          <div className="row g-2">
            {gapRows.map((g) => (
              <div key={g.label} className="col-6 col-sm-3">
                <Card className="loi-gap-card" variant="flat" noPadding>
                  <div className="loi-gap-val loi-text-low">{g.value}</div>
                  <div className="loi-hint mt-1">{g.label}</div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="loi-box">
        <div className="loi-box-title d-flex align-items-center flex-wrap gap-2 mb-3">
          <CalendarClock size={11} />
          Deal Timeline
        </div>

        <div className="loi-timeline">
          {timeline.map((t) => (
            <div key={t.step} className="loi-timeline-row">
              <div
                className={`loi-timeline-num ${
                  t.done
                    ? "loi-tnum--done"
                    : t.active
                      ? "loi-tnum--active"
                      : "loi-tnum--idle"
                }`}
              >
                {t.done ? <CheckCheck size={11} /> : t.step}
              </div>
              <div className="loi-timeline-body">
                <div
                  className={`loi-timeline-label ${
                    t.done
                      ? "loi-text-green"
                      : t.active
                        ? "loi-text-green-light"
                        : "loi-text-secondary"
                  }`}
                >
                  {t.label}
                </div>
                {t.timestamp && (
                  <div className="loi-hint mt-1">
                    {new Date(t.timestamp).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
                {t.active && (
                  <div className="loi-timeline-warning d-flex align-items-center gap-1 mt-1">
                    <AlertTriangle size={10} />
                    step.done = false · your move
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
