import { getChangesByGroupAndDate, addChange, updateChange, deleteChange } from "../service/ScheduleService";
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import '/src/components/CommonStyle.css';
import '/src/components/ChangesControl.css';

export default function ChangesControl() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupNumber, date } = location.state || {};

  const [changes, setChanges] = useState([]);
  const [ifUpdate, setIfUpdate] = useState(false);
  const [outerModalIsOpen, setOuterModalIsOpen] = useState(false);
  const [innerModalIsOpen, setInnerModalIsOpen] = useState(false);

  const [lessonId, setLessonId] = useState();
  const [lessonName, setLessonName] = useState();
  const [lessonFullName, setLessonFullName] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [lessonType, setLessonType] = useState();
  const [auditoriumCurrent, setAuditoriumCurrent] = useState();
  const [auditoriums, setAuditoriums] = useState([]);
  const [subgroup, setSubgroup] = useState();
  const [note, setNote] = useState();

  const [teacherUrlId, setTeacherUrlId] = useState();
  const [teacherName, setTeacherName] = useState();
  const [teacherSurname, setTeacherSurname] = useState();
  const [teacherPatronymic, setTeacherPatronymic] = useState();
  const [teacherDegree, setTeacherDegree] = useState();
  const [teacherEmail, setTeacherEmail] = useState();
  const [teachers, setTeachers] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState();
  const [modalTeacherInfoIsOpen, setModalTeacherInfoIsOpen] = useState();

  const fetchChanges = useCallback(() => {
    if (groupNumber && date) {
      getChangesByGroupAndDate(groupNumber, date)
        .then((response) => {
          setChanges(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [groupNumber, date]);

  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  function handleTeacherAdd(e) {
    e.preventDefault();
    setTeachers([...teachers, {
      urlId: teacherUrlId,
      name: teacherName,
      surname: teacherSurname,
      patronymic: teacherPatronymic,
      degree: teacherDegree,
      email: teacherEmail
    }]);
    setInnerModalIsOpen(false);
  }

  function handleAdd(e) {
    e.preventDefault();
    const lesson = {
      name: lessonName,
      subjectFullName: lessonFullName,
      startTime: startTime,
      endTime: endTime,
      note: note,
      lessonTypeAbbr: lessonType,
      auditoriums: auditoriums,
      subgroupNum: subgroup,
      teachers: teachers
    };
    if (ifUpdate) {
      updateChange(lessonId, lesson).then(() => {
        fetchChanges();
        setIfUpdate(false);
        setOuterModalIsOpen(false);
      });
    } else {
      addChange(groupNumber, date, lesson).then(() => {
        fetchChanges();
        setOuterModalIsOpen(false);
      });
    }
  }

  function handleDelete(changeId) {
    deleteChange(changeId).then(() => {
      fetchChanges();
    });
  }

  return (
    <>
      <h2 className='text-center'>Изменения в расписании</h2>
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
          <th>Операции</th>
        </tr>
        </thead>
        <tbody>
        {changes.map((change, index) => (
          <tr key={index}>
            <td>{change.name}</td>
            <td>{change.subjectFullName}</td>
            <td>{change.startTime}</td>
            <td>{change.endTime}</td>
            <td>{change.lessonTypeAbbr}</td>
            <td>{change.auditoriums.map((auditorium, idx) => (
              <span key={idx}>{auditorium}<br/></span>
            ))}</td>
            <td>{change.subgroupNum === 0 ? 'Обе подгруппы' : `${change.subgroupNum}-я подгруппа`}</td>
            <td>{change.note}</td>
            <td>
              {change.teachers.map((teacher, idx) => (
                <a key={idx} href="#" onClick={() => {
                  setSelectedTeacher(teacher)
                  setModalTeacherInfoIsOpen(true);
                }}>
                  {teacher.surname} {teacher.name} {teacher.patronymic} <br/>
                </a>
              ))}
            </td>
            <td>
              <button className='small-button' onClick={() => {
                setLessonId(change.id);
                setLessonName(change.name);
                setLessonFullName(change.subjectFullName);
                setStartTime(change.startTime);
                setEndTime(change.endTime);
                setLessonType(change.lessonTypeAbbr);
                setAuditoriums(change.auditoriums);
                setSubgroup(change.subgroupNum);
                setNote(change.note);
                setTeachers(change.teachers);
                setIfUpdate(true);
                setOuterModalIsOpen(true);
              }}>Изменить</button>
              <button className='small-button' onClick={() => handleDelete(change.id)}>Удалить</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <button onClick={() => {
        navigate('/', { state: { groupNumber, date } });
      }}>Вернуться к расписанию</button>
      <button onClick={() => {setOuterModalIsOpen(true)}}>Добавить изменение</button>
      <Modal
        isOpen={outerModalIsOpen}
        onRequestClose={() => setOuterModalIsOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <form onSubmit={handleAdd}>
          <label>Сокращённое название</label><br/>
          <input type="text" value={lessonName} onChange={(e) =>
            setLessonName(e.target.value)} required /><br/>
          <label>Полное название</label><br/>
          <input type="text" value={lessonFullName} onChange={(e) =>
            setLessonFullName(e.target.value)} required /><br/>
          <label>Начало</label><br/>
          <input type="time" value={startTime} onChange={(e) =>
            setStartTime(e.target.value)} required /><br/>
          <label>Конец</label><br/>
          <input type="time" value={endTime} onChange={(e) =>
            setEndTime(e.target.value)} required /><br/>
          <label>Тип занятия</label><br/>
          <input type="text" value={lessonType} onChange={(e) =>
            setLessonType(e.target.value)} required /><br/>
          <label>Аудитории</label><br/>
          <input type="text" value={auditoriumCurrent} onChange={(e) =>
            setAuditoriumCurrent(e.target.value)} /><br/>
          <button type="button" onClick={() =>
            setAuditoriums([...auditoriums, auditoriumCurrent])}>Добавить аудиторию</button>
          <button type='button' onClick={() => setAuditoriums([])}>Очистить аудитории</button>
          <ul>
            {auditoriums.map((aud, index) => (
              <li key={index}>{aud}</li>
            ))}
          </ul><br/>
          <label>Подгруппа</label><br/>
          <select value={subgroup} onChange={(e) =>
            setSubgroup(e.target.value)} required>
            <option value={0}>Обе подгруппы</option>
            <option value={1}>1-я подгруппа</option>
            <option value={2}>2-я подгруппа</option>
          </select><br/>
          <label>Заметки</label><br/>
          <input type="text" value={note} onChange={(e) =>
            setNote(e.target.value)} /><br/>
          <label>Преподаватели</label><br/>
          <ul>
            {teachers.map((teacher, index) => (
              <li key={index}>{teacher.surname} {teacher.name} {teacher.patronymic}</li>
            ))}
          </ul>
          <button type="button" onClick={() => setInnerModalIsOpen(true)}>
            Добавить преподавателя</button>
          <button type='button' onClick={() => setTeachers([])}>Очистить преподавателей</button><br/>
          <button type="submit">{ifUpdate ? 'Обновить' : 'Добавить'}</button>
        </form>
      </Modal>

      <Modal
        isOpen={innerModalIsOpen}
        onRequestClose={() => setInnerModalIsOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <form onSubmit={handleTeacherAdd}>
          <label>UrlId</label><br/>
          <input type="text" value={teacherUrlId} onChange={(e) => setTeacherUrlId(e.target.value)} required /><br/>
          <label>Фамилия</label><br/>
          <input type="text" value={teacherSurname} onChange={(e) => setTeacherSurname(e.target.value)} required /><br/>
          <label>Имя</label><br/>
          <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} required /><br/>
          <label>Отчество</label><br/>
          <input type="text" value={teacherPatronymic} onChange={(e) => setTeacherPatronymic(e.target.value)} required /><br/>
          <label>Степень</label><br/>
          <input type="text" value={teacherDegree} onChange={(e) => setTeacherDegree(e.target.value)} /><br/>
          <label>Email</label><br/>
          <input type="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} /><br/>
          <button type="submit">Добавить</button>
        </form>
      </Modal>

      {selectedTeacher && (
        <Modal
          isOpen={modalTeacherInfoIsOpen}
          onRequestClose={() => {
            setModalTeacherInfoIsOpen(false);
            setSelectedTeacher(null);
          }}
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
          <button className="close-button" onClick={() => {
            setModalTeacherInfoIsOpen(false);
            setSelectedTeacher(null);
          }}>Закрыть</button>
        </Modal>
      )}
    </>
  );
}