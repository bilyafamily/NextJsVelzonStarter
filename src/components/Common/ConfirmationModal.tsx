import React from "react";
import { Modal, ModalBody } from "reactstrap";

interface ConfirmationModalProps {
  show?: boolean;
  onConfirmClick?: () => void;
  onCloseClick?: () => void;
  recordId?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onConfirmClick,
  onCloseClick,
  recordId,
}) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <i className="ri-question-line display-5 text-danger"></i>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you sure ?</h4>
            <p className="text-muted mx-4 mb-0">
              Are you sure you want to continue with this operation{" "}
              {recordId ? recordId : ""} ?
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light material-shadow-none"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            Close
          </button>
          <button
            type="button"
            className="btn w-sm btn-success material-shadow-none"
            id="delete-record"
            onClick={onConfirmClick}
          >
            Yes, Proceed!
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmationModal;
