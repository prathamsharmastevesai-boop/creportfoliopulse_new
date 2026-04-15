import React, { useEffect, useState } from 'react';
import { Approved_list_submit, Denied_list_submit } from '../../Networking/Admin/APIs/PermissionApi';
import { useDispatch } from 'react-redux';
import RAGLoader from '../../Component/Loader';
import PageHeader from '../../Component/PageHeader/PageHeader';
import Card from '../../Component/Card/Card';

export const Approved_Denied_list = () => {
  const [approvedList, setApprovedList] = useState([]);
  const [deniedList, setDeniedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const approvedRes = await dispatch(Approved_list_submit());
        const approvedData = approvedRes.payload || approvedRes;
        const approved = [];
        const denied = [];

        approvedData.forEach((user) => {
          user.requested_buildings.forEach((request) => {
            const item = {
              userName: user.user_name,
              email: user.email,
              building: request.building_name,
              status: request.status,
              createdAt: request.created_at,
              updatedAt: request.updated_at,
            };

            if (request.status === 'approved') {
              approved.push(item);
            } else if (request.status === 'denied') {
              denied.push(item);
            }
          });
        });

        setApprovedList(approved);
        setDeniedList(denied);

        const deniedRes = await dispatch(Denied_list_submit());
        const deniedData = deniedRes.payload || deniedRes;
        const additionalDenied = [];

        deniedData.forEach((user) => {
          user.requested_buildings.forEach((request) => {
            if (request.status === 'denied') {
              const item = {
                userName: user.user_name,
                email: user.email,
                building: request.building_name,
                status: request.status,
                createdAt: request.created_at,
                updatedAt: request.updated_at,
              };
              additionalDenied.push(item);
            }
          });
        });

        setDeniedList((prev) => [
          ...prev,
          ...additionalDenied.filter(
            (item) =>
              !prev.some(
                (existing) =>
                  existing.email === item.email &&
                  existing.building === item.building &&
                  existing.status === 'denied'
              )
          ),
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const formatDate = (datetime) => new Date(datetime).toLocaleString();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
       <RAGLoader /> 
      </div>
    );
  }

  return (
    <div className="container p-4">
      <PageHeader
        title="Request Status History"
        subtitle="Track all approved and denied building access requests"
      />
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <Card 
            title="Approved Requests" 
            headerClass="bg-success text-white"
            className="h-100 shadow-sm"
          >
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              {approvedList.length === 0 ? (
                <p className="text-muted text-center py-4">No approved requests yet.</p>
              ) : (
                approvedList.map((item, index) => (
                  <div key={index} className="mb-3 p-3 border rounded bg-light hover-bg-white transition-all">
                    <div className="d-flex justify-content-between">
                      <p className="mb-1"><strong>{item.userName}</strong></p>
                      <span className="badge bg-success-subtle text-success border border-success-subtle small px-2 py-1">Approved</span>
                    </div>
                    <p className="mb-1 small"><strong>Building:</strong> {item.building}</p>
                    <p className="text-muted extra-small mb-0"><em>Updated:</em> {formatDate(item.updatedAt)}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="col-md-6 mb-4">
          <Card 
            title="Denied Requests" 
            headerClass="bg-danger text-white"
            className="h-100 shadow-sm"
          >
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              {deniedList.length === 0 ? (
                <p className="text-muted text-center py-4">No denied requests recorded.</p>
              ) : (
                deniedList.map((item, index) => (
                  <div key={index} className="mb-3 p-3 border rounded bg-light hover-bg-white transition-all">
                    <div className="d-flex justify-content-between">
                      <p className="mb-1"><strong>{item.userName}</strong></p>
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle small px-2 py-1">Denied</span>
                    </div>
                    <p className="mb-1 small"><strong>Building:</strong> {item.building}</p>
                    <p className="text-muted extra-small mb-0"><em>Updated:</em> {formatDate(item.updatedAt)}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
