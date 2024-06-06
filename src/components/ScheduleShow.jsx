import { getScheduleByGroupAndDate } from "../service/ScheduleService";
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '/src/components/CommonStyle.css';
import '/src/components/ScheduleShow.css';
import {useLocation, useNavigate} from "react-router-dom";

export default function ShowLessons() {
  const [lessons, setLessons] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [groupNumber, setGroupNumber] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState(false);
  const [changesButtonActive, setChangesButtonActive] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (search) {
      getScheduleByGroupAndDate(groupNumber, date)
        .then((response) => {
          setLessons(response.data);
          setChangesButtonActive(true);
        })
        .catch(error => {
          setChangesButtonActive(false);
          console.error(error);
        }).finally(() => setSearch(false));
    }
  }, [search, groupNumber, date]);

  const openModal = (teacher) => {
    setSelectedTeacher(teacher);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTeacher(null);
  };

  const handleGroupNumberChange = (e) => {
    setGroupNumber(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
  };

  function LessonTable({lessons}) {
    return (
      <div className='lessons-table'>
        <table className='table'>
          <thead>
          <tr>
            <th>Предмет</th>
            <th>Полное название предмета</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Тип занятия</th>
            <th>Аудитории</th>
            <th>Подгруппа</th>
            <th>Заметки</th>
            <th>Преподаватели</th>
          </tr>
          </thead>
          <tbody>
          {lessons.map((lesson, index) => (
            <tr key={index}>
              <td>{lesson.name}</td>
              <td>{lesson.subjectFullName}</td>
              <td>{lesson.startTime}</td>
              <td>{lesson.endTime}</td>
              <td>{lesson.lessonTypeAbbr}</td>
              <td>{lesson.auditoriums.map((aud, idx) => (
                <span key={idx}>{aud}<br/></span>
              ))}</td>
              <td>{lesson.subgroupNum === 0 ? 'Обе подгруппы' : `${lesson.subgroupNum}-я подгруппа`}</td>
              <td>{lesson.note}</td>
              <td>
                {lesson.teachers.map((teacher, idx) => (
                  <a key={idx} href="#" onClick={() => openModal(teacher)}>
                    {teacher.surname} {teacher.name} {teacher.patronymic} <br/>
                  </a>
                ))}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className='basic-container'>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="groupNumber"
            placeholder='Номер группы'
            value={groupNumber}
            onChange={handleGroupNumberChange}
          />
          <input
            type="text"
            name="date"
            placeholder="Дата"
            value={date}
            onChange={handleDateChange}
          />
          <button type="submit">Найти</button>
        </form>
        <h2 className='text-center'>Список предметов</h2>
      </div>
      <LessonTable lessons={lessons}/>
      <button onClick={() => {
        navigate('/changes', { state: { groupNumber, date } });
      }} disabled={!changesButtonActive}>Управление изменениями в расписании</button>
      {selectedTeacher && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <div className='teacher-info'>
            <p>Фамилия: {selectedTeacher.surname}</p>
            <p>Имя: {selectedTeacher.name}</p>
            <p>Отчество: {selectedTeacher.patronymic}</p>
            {selectedTeacher.degree && <p>Степень: {selectedTeacher.degree}</p>}
            {selectedTeacher.email && <p>Email: {selectedTeacher.email}</p>}
          </div>
          <button className="close-button" onClick={closeModal}>Закрыть</button>
        </Modal>
      )}
    </div>
  );
}