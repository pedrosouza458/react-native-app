import "styled-components/native";
import Colors from "./constants/Colors"; // Ajuste o caminho se necessário

// Pegamos a estrutura de um dos seus temas (ex: o light) como base
type ThemeType = typeof Colors.light;

declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeType {}
}
