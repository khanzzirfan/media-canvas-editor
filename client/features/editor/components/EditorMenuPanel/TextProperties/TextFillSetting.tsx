import React from 'react';
import { RGBColor } from 'react-color';
import { useRecoilValue } from 'recoil';
import { fromRgba, toRgba } from '../../../../../utils/color';
import { TextConfig } from '../../../interfaces/Shape';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import { elementPropsSelector } from '../../../state/selectors/elements';
import PanelColorPicker from '../../ui/PanelColorPicker';
import SideMenuSetting from '../../ui/SideMenuSetting';

interface Props {
  elementId: string;
}

function TextFillSetting({ elementId }: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<TextConfig>(elementId)
  );

  const { updateElementProps } = useElementsDispatcher();

  const handleChangeEnabled = (fillEnabled: boolean) => () => {
    updateElementProps<TextConfig>(elementId, {
      fillEnabled,
    });
  };

  const changeColor = (color: RGBColor) => {
    updateElementProps<TextConfig>(elementId, { fill: toRgba(color) });
  };

  return (
    <SideMenuSetting
      label="Fill"
      htmlFor="input-fill-color"
      onDelete={handleChangeEnabled(false)}
      onCreate={handleChangeEnabled(true)}
      deleted={!elementProps.fillEnabled}
    >
      <PanelColorPicker
        rgba={elementProps.fill ? fromRgba(elementProps.fill) : undefined}
        id="input-fill-color"
        onChange={changeColor}
      />
    </SideMenuSetting>
  );
}

export default TextFillSetting;
