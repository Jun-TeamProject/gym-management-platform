import api from "./api";

export const ReservationApi = {
  getMyReservations: (userId, role) => {
    if (role === "TRAINER") {
      return api.get(`/api/reservations/trainer/${userId}`);
    } else {
      return api.get(`/api/reservations/member/${userId}`);
    }
  },

  createReservation: (reservationData) => {
    return api.post("/api/reservations", reservationData);
  },

  confirmReservation: (reservationId) => {
    return api.put(`/api/reservations/${reservationId}/confirm`);
  },

  deleteReservation: (reservationId) => {
    return api.delete(`/api/reservations/${reservationId}`);
  },
};
