import { create } from 'zustand';

export type PermissionStatus = 'unknown' | 'granted' | 'denied';

type State = {
  latitude: number | null;
  longitude: number | null;
  permissionStatus: PermissionStatus;
  setLocation: (lat: number | null, lon: number | null) => void;
  setPermissionStatus: (s: PermissionStatus) => void;
};

export const useLocationStore = create<State>((set) => ({
  latitude: null,
  longitude: null,
  permissionStatus: 'unknown',
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setPermissionStatus: (permissionStatus) => set({ permissionStatus }),
}));
