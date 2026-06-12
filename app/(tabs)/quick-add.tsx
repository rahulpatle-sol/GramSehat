import { useEffect } from 'react';
import { router } from 'expo-router';

export default function QuickAddScreen() {
  useEffect(() => {
    router.back();
  }, []);
  return null;
}
