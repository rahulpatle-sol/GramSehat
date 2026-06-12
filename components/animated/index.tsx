import React, { ReactElement, ReactNode, useRef } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeInDown,
  FadeInUp,
  FadeIn,
  SlideInRight,
  SlideInLeft,
  BounceIn,
  ZoomIn,
  Layout,
} from 'react-native-reanimated';
import { Radius } from '../../constants/theme';

type AnimatedPressableProps = TouchableOpacityProps & {
  scaleTo?: number;
};

export function AnimatedPressable({
  children,
  scaleTo = 0.96,
  style,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps): ReactElement {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style as StyleProp<ViewStyle>]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={(e) => {
          scale.value = withSpring(scaleTo, { stiffness: 300, damping: 20 });
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, { stiffness: 300, damping: 20 });
          onPressOut?.(e);
        }}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  index: number;
  style?: StyleProp<ViewStyle>;
};

export function StaggerItem({ children, index, style }: StaggerItemProps): ReactElement {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify().stiffness(200).damping(24)}
      layout={Layout.springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

type AnimatedSectionProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function FadeInSection({ children, style }: AnimatedSectionProps): ReactElement {
  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function SlideInSection({ children, style, fromRight = true }: AnimatedSectionProps & { fromRight?: boolean }): ReactElement {
  const animation = fromRight ? SlideInRight : SlideInLeft;
  return (
    <Animated.View
      entering={animation.duration(350).springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function BounceSection({ children, style }: AnimatedSectionProps): ReactElement {
  return (
    <Animated.View
      entering={BounceIn.duration(500).springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function ZoomSection({ children, style }: AnimatedSectionProps): ReactElement {
  return (
    <Animated.View
      entering={ZoomIn.duration(350).springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: string;
};

export function AnimatedChip({ label, selected, onPress, icon }: ChipProps): ReactElement {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: Radius.full,
          backgroundColor: selected ? '#059669' : '#f1f5f9',
          borderWidth: 1.5,
          borderColor: selected ? '#059669' : '#e2e8f0',
        }}
      >
        {icon && <Animated.Text style={{ fontSize: 14 }}>{icon}</Animated.Text>}
        <Animated.Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: selected ? '#ffffff' : '#475569',
          }}
        >
          {label}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function SkeletonCard(): ReactElement {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        backgroundColor: '#e2e8f0',
        borderRadius: Radius.lg,
        height: 120,
        marginBottom: 12,
      }}
    />
  );
}

export {
  Animated,
  FadeInDown,
  FadeInUp,
  FadeIn,
  SlideInRight,
  SlideInLeft,
  BounceIn,
  ZoomIn,
  Layout,
  withSpring,
  withTiming,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
};
