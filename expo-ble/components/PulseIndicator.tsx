import React from "react";

import {
  Canvas,
  Circle,
  Image,
  useClockValue,
  useComputedValue,
  useImage,
} from "@shopify/react-native-skia";
import { View } from "react-native";

export const PulseIndicator = () => {
  const clock1 = useClockValue();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bluetooth = useImage(require("../img/bluetooth.png"));

  const interval = 1250;

  const scale = useComputedValue(() => {
    return ((clock1.current % interval) / interval) * 110;
  }, [clock1]);

  const opacity = useComputedValue(() => {
    return 0.9 - (clock1.current % interval) / interval;
  }, [clock1]);

  const scale2 = useComputedValue(() => {
    return (((clock1.current + 400) % interval) / interval) * 110;
  }, [clock1]);

  const opacity2 = useComputedValue(() => {
    return 0.9 - ((clock1.current + 400) % interval) / interval;
  }, [clock1]);

  if (!bluetooth) {
    return <View />;
  }

  return (
    <Canvas style={{ height: 200, width: 300 }}>
      <Circle cx={150} cy={100} r={50} opacity={1} color="#FF6060"></Circle>
      <Circle cx={150} cy={100} r={scale} opacity={opacity} color="#FF6060" />
      <Circle cx={150} cy={100} r={scale2} opacity={opacity2} color="#FF6060" />
      <Image
        image={bluetooth}
        fit="contain"
        x={125}
        y={75}
        width={50}
        height={50}
      />
    </Canvas>
  );
};
