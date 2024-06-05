import axios from "axios";

const START_URL = 'https://groupschedule.onrender.com/api/v1/'; // Добавлен 'http://' в начало URL

export const getScheduleByGroupAndDate = (groupNumber, date) => axios.get(`${START_URL}schedule_gr`, {
  params: {
    groupNumber,
    date
  }
})

export const getChangesByGroupAndDate =
  (groupNumber, date) => axios.get(`${START_URL}changes/${groupNumber}/${date}`)

export const addChange = (groupNumber, date, newLesson) =>
  axios.post(`${START_URL}changes?groupNum=${groupNumber}&date=${date}`, newLesson)

export const updateChange = (id, newLesson) =>
  axios.put(`${START_URL}changes/${id}`, newLesson)

export const deleteChange = (id) =>
  axios.delete(`${START_URL}changes/${id}`)