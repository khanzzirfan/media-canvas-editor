import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import YoutubeIcon from "../../../../../components/ui/Icons/YoutubeIcon";
import { EditorPanel } from "../../../interfaces/Editor";
import { activePanelState } from "../../../state/atoms/editor";
import { isEitherPanelActiveSelector } from "../../../state/selectors/editor";
import SideMenuButton from "../../ui/SideMenuButton";

function VideoToolButton() {
  const setActivePanel = useSetRecoilState(activePanelState);
  const selected = useRecoilValue(
    isEitherPanelActiveSelector([EditorPanel.Subtitles]),
  );

  const handleClick = () => {
    setActivePanel(EditorPanel.Subtitles);
  };

  return (
    <SideMenuButton
      onClick={handleClick}
      selected={selected}
      icon={YoutubeIcon}
    >
      Video
    </SideMenuButton>
  );
}

export default VideoToolButton;
