export interface PartnerInfo {
  name: string;
  welcome_text: string;
  link: string;
  logo: string;
  favicon: string;
  parameters: {
    lightLogo?: string;
    darkLogo?: string;
    welcomeDescription?: string;
    primary_lighter?: string;
    primary_light?: string;
    primary?: string;
    primary_dark?: string;
    primary_darker?: string;
    primary_darkest?: string;
    tabTitle?: string;
    partnerName?: string;
    startSession?: string;
    launchSession?: string;
    joinArrow?: string;
    rightCaret?: string;
    rightLaunchArrow?: string;
    infoIcon?: string;
    checkIcon?: string;
    joinLobbyUrl?: string;
    footerBackgroundColor?: string;
  };
}
