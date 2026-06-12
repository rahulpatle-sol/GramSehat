import React, { ReactElement, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  Animated as RNAnimated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../src/i18n';
import { Colors, Spacing, Radius, Shadow, Typography } from '../constants/theme';

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ visible, onCancel, onConfirm }: LogoutModalProps): ReactElement {
  const scaleAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      RNAnimated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        stiffness: 250,
        damping: 20,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <RNAnimated.View style={[styles.dialog, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="log-out-outline" size={32} color={Colors.danger} />
          </View>
          <Text style={styles.title}>{i18n.t('logoutConfirmTitle')}</Text>
          <Text style={styles.message}>{i18n.t('logoutConfirmMessage')}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              activeOpacity={0.7}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{i18n.t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.confirmBtn]}
              activeOpacity={0.7}
              onPress={onConfirm}
            >
              <Ionicons name="log-out-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.confirmText}>{i18n.t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </RNAnimated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  dialog: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...Shadow.xl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
  },
  confirmBtn: {
    backgroundColor: Colors.danger,
  },
  cancelText: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  confirmText: {
    ...Typography.captionBold,
    color: '#fff',
  },
});
