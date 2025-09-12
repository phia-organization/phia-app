import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const CustomSemiCircleProgress = ({
  children,
  animationSpeed = 2,
  initialPercentage = 0,
  percentage,
  minValue = 0,
  maxValue = 14,
  currentValue,
  circleRadius = 120,
  progressShadowColor = '#F0F0F0',
  progressColor = '#ECA20F',
  progressWidth = 20,
  interiorCircleColor = Colors.default.background,
  exteriorCircleStyle = {},
  interiorCircleStyle = {},
}: any) => {
  const [rotationAnimation, setRotationAnimation] = useState(
    new Animated.Value(initialPercentage)
  );

  useEffect(() => {
    animate();
  }, []);

  const animate = () => {
    const toValue = getPercentage();
    const speed = animationSpeed;

    Animated.spring(rotationAnimation, {
      toValue,
      speed,
      useNativeDriver: true,
    }).start();
  };

  const getPercentage = () => {
    if (percentage) return Math.max(Math.min(percentage, 100), 0);

    if (currentValue && minValue && maxValue) {
      const newPercent =
        ((currentValue - minValue) / (maxValue - minValue)) * 100;
      return Math.max(Math.min(newPercent, 100), 0);
    }

    return 0;
  };

  const getStyles = () => {
    const interiorCircleRadius = circleRadius - progressWidth;

    return StyleSheet.create({
      exteriorCircle: {
        width: circleRadius * 2,
        height: circleRadius,
        borderRadius: circleRadius,
        backgroundColor: progressShadowColor,
      },
      rotatingCircleWrap: {
        width: circleRadius * 2,
        height: circleRadius,
        top: circleRadius,
      },
      rotatingCircle: {
        width: circleRadius * 2,
        height: circleRadius,
        borderRadius: circleRadius,
        backgroundColor: progressColor,
        transform: [
          { translateY: -circleRadius / 2 },
          {
            rotate: rotationAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: ['0deg', '180deg'],
            }),
          },
          { translateY: circleRadius / 2 },
        ],
      },
      interiorCircle: {
        width: interiorCircleRadius * 2,
        height: interiorCircleRadius,
        borderRadius: interiorCircleRadius,
        backgroundColor: interiorCircleColor,
        top: progressWidth,
      },
    });
  };
  const styles = getStyles();
  return (
    <View
      style={[
        defaultStyles.exteriorCircle,
        styles.exteriorCircle,
        exteriorCircleStyle,
      ]}
    >
      <View
        style={[defaultStyles.rotatingCircleWrap, styles.rotatingCircleWrap]}
      >
        <Animated.View
          style={[defaultStyles.rotatingCircle, styles.rotatingCircle]}
        />
      </View>
      <View
        style={[
          defaultStyles.interiorCircle,
          styles.interiorCircle,
          interiorCircleStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

export default CustomSemiCircleProgress;

const defaultStyles = StyleSheet.create({
  exteriorCircle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  rotatingCircleWrap: {
    position: 'absolute',
    left: 0,
  },
  rotatingCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  interiorCircle: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
