import React from "react";

interface Props {
  error: any;
  refetch: () => void;
}

function ErrorIndicator({ error, refetch }: Props) {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Sectors</h4>
          <p>{error.message || "An error occurred while loading sectors"}</p>
          <hr />
          <button className="btn btn-danger" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorIndicator;
