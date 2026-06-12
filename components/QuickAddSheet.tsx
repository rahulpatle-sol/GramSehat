import React, { ReactElement } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, BounceIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, Typography } from '../constants/theme';
import { AnimatedPressable } from './animated';

interface QuickAddSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddPerson: () => void;
  onAddRecord: () => void;
}

export default function QuickAddSheet({ visible, onClose, onAddPerson, onAddRecord }: QuickAddSheetProps): ReactElement {
  const insets = useSafeAreaInsets();

  const options = [
    {
      icon: <Ionicons name="person-add-outline" size={28} color="#059669" />,
      title: 'Add Family Member',
      desc: 'Add your spouse, children, or parents',
      onPress: () => { onClose(); setTimeout(onAddPerson, 300); },
      color: '#059669',
      bgColor: '#f0fdf4',
    },
    {
      icon: <MaterialCommunityIcons name="clipboard-plus-outline" size={28} color="#7c3aed" />,
      title: 'Add Health Record',
      desc: 'Checkup, prescription, test or vaccination',
      onPress: () => { onClose(); setTimeout(onAddRecord, 300); },
      color: '#7c3aed',
      bgColor: '#f5f3ff',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={BounceIn.duration(400).springify()} style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.title}>Quick Add</Text>
            <Text style={styles.subtitle}>What would you like to add?</Text>

            <View style={styles.optionsRow}>
              {options.map((opt, i) => (
                <AnimatedPressable
                  key={opt.title}
                  style={[styles.optionCard, { backgroundColor: opt.bgColor }]}
                  onPress={opt.onPress}
                >
                  <View style={[styles.optionIcon, { backgroundColor: opt.color + '20' }]}>
                    {opt.icon}
                  </View>
                  <Text style={styles.optionTitle}>{opt.title}</Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </AnimatedPressable>
              ))}
            </View>

            <AnimatedPressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </AnimatedPressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: Spacing.lg,
  },
  title: { ...Typography.h2, color: Colors.text, textAlign: 'center' },
  subtitle: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs, marginBottom: Spacing.xl },
  optionsRow: { flexDirection: 'row', gap: Spacing.md },
  optionCard: {
    flex: 1, padding: Spacing.lg, borderRadius: Radius.lg,
    alignItems: 'center', gap: Spacing.sm,
  },
  optionIcon: {
    width: 52, height: 52, borderRadius: Radius.lg,
    justifyContent: 'center', alignItems: 'center',
  },
  optionTitle: { ...Typography.bodyBold, color: Colors.text, textAlign: 'center' },
  optionDesc: { ...Typography.small, color: Colors.textSecondary, textAlign: 'center' },
  cancelBtn: {
    marginTop: Spacing.lg, paddingVertical: Spacing.md,
    alignItems: 'center', borderRadius: Radius.lg,
    backgroundColor: '#f1f5f9',
  },
  cancelText: { ...Typography.bodyBold, color: Colors.textSecondary },
});
