import React, { useEffect, useState } from "react";
import JobItem from "./JobItem";
import ModalConfirm from "./ModalConfirm";

export default function Todolist() {
  const [inputValue, setInputValue] = useState("");
  const [allJobs, setAllJobs] = useState(() => {
    return JSON.parse(localStorage.getItem("jobs")) || [];
  });
  const [listJob, setListJob] = useState(allJobs);

  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [id, setId] = useState(null);
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    let filtered = [];

    switch (status) {
      case "ACTIVE":
        filtered = allJobs.filter((job) => job.status);
        break;
      case "INACTIVE":
        filtered = allJobs.filter((job) => !job.status);
        break;
      default:
        filtered = allJobs;
        break;
    }

    setListJob(filtered);
  }, [status, allJobs]);

  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    if (id) {
      // Sửa
      const newListJob = allJobs.map((job) =>
        job.id === id ? { ...job, name: inputValue } : job
      );

      localStorage.setItem("jobs", JSON.stringify(newListJob));
      setAllJobs(newListJob);
      setInputValue("");
      setId(null);
    } else {
      // Thêm
      const newJob = {
        id: Math.ceil(Math.random() * 100000),
        name: inputValue,
        status: false,
      };

      const newListJob = [...allJobs, newJob];
      localStorage.setItem("jobs", JSON.stringify(newListJob));
      setAllJobs(newListJob);
      setInputValue("");
    }
  };

  // Thay đổi trạng thái công việc
  const handleChangeStatus = (idUpdate) => {
    const newListJob = allJobs.map((job) =>
      job.id === idUpdate ? { ...job, status: !job.status } : job
    );

    localStorage.setItem("jobs", JSON.stringify(newListJob));
    setAllJobs(newListJob);
  };

  // Mở modal xác nhận xóa công việc
  const handleShowModal = () => {
    setIsShowModalDelete(true);
  };

  // Đóng modal xác nhận xóa công việc
  const handleCloseModal = () => {
    setIsShowModalDelete(false);
  };

  // Xác nhận xóa công việc
  const handleConfirmDelete = (id) => {
    handleShowModal();
    setId(id);
  };

  // Xóa công việc
  const handleDelete = () => {
    const newListJob = allJobs.filter((job) => job.id !== id);
    localStorage.setItem("jobs", JSON.stringify(newListJob));
    setAllJobs(newListJob);
    handleCloseModal();
    setId(null);
  };

  // Lấy thông tin công việc để sửa
  const handleGetJobInfo = (job) => {
    if (job) {
      setInputValue(job.name);
      setId(job.id);
    }
  };
  return (
    <>
      <ModalConfirm
        onDelete={handleDelete}
        isShow={isShowModalDelete}
        onClose={handleCloseModal}
      />

      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <form
                    onSubmit={handleSubmit}
                    className="d-flex justify-content-center align-items-center mb-4"
                  >
                    <div className="flex-fill">
                      <input
                        value={inputValue}
                        onChange={handleChangeInput}
                        placeholder="Nhập tên công việc..."
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <button type="submit" className="btn btn-info ms-2">
                      {id ? "Lưu" : "Thêm"}
                    </button>
                  </form>

                  <ul className="nav nav-tabs mb-4 pb-2">
                    <li onClick={() => setStatus("ALL")} className="nav-item">
                      <a className={`nav-link ${status === "ALL" && "active"}`}>
                        Tất cả
                      </a>
                    </li>
                    <li
                      onClick={() => setStatus("ACTIVE")}
                      className="nav-item"
                    >
                      <a
                        className={`nav-link ${
                          status === "ACTIVE" && "active"
                        }`}
                      >
                        Đã hoàn thành
                      </a>
                    </li>
                    <li
                      onClick={() => setStatus("INACTIVE")}
                      className="nav-item"
                    >
                      <a
                        className={`nav-link ${
                          status === "INACTIVE" && "active"
                        }`}
                      >
                        Chưa hoàn thành
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content" id="ex1-content">
                    <div className="tab-pane fade show active">
                      <ul className="list-group mb-0">
                        {listJob.map((job) => (
                          <JobItem
                            key={job.id}
                            job={job}
                            onChangeStatus={handleChangeStatus}
                            onConfirmDelete={handleConfirmDelete}
                            onGetJobInfo={handleGetJobInfo}
                          />
                        ))}
                      </ul>
                      {listJob.length === 0 && (
                        <p className="text-center mt-3">
                          Không có công việc nào để hiển thị.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
