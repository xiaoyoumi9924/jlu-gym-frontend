import { createRouter, createWebHashHistory } from 'vue-router'
import { venues } from '../data/venues'
import VenuePickerView from '../views/VenuePickerView.vue'
import VenueHomeView from '../views/VenueHomeView.vue'
import ReservationView from '../views/ReservationView.vue'
import ProfileView from '../views/ProfileView.vue'
import MyBookingsView from '../views/MyBookingsView.vue'
import BookingDetailView from '../views/BookingDetailView.vue'

const storageKey = 'jlu-gym-active-venue'

export const getActiveVenueId = () => {
  const stored = localStorage.getItem(storageKey)
  return venues[stored] ? stored : 'song'
}

export const setActiveVenue = (id) => {
  localStorage.setItem(storageKey, venues[id] ? id : 'song')
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/venues' },
    { path: '/venues', component: VenuePickerView },
    { path: '/home/:venueId', component: VenueHomeView, props: true },
    { path: '/reserve/:venueId', component: ReservationView, props: true },
    { path: '/profile', component: ProfileView },
    { path: '/my-bookings', component: MyBookingsView },
    { path: '/my-bookings/detail/:orderNo', component: BookingDetailView },
    { path: '/:pathMatch(.*)*', redirect: '/venues' },
  ],
})
