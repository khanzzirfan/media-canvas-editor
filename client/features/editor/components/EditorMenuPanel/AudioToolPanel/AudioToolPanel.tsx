import { UploadOutline } from 'heroicons-react';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../../../components/ui/Button';
import { Plan } from '../../../../../containers/interfaces';
import { UserContainer } from '../../../../../containers/UserContainer';
import { EditorContainer } from '../../../containers/EditorContainer/EditorContainer';
import AudioModal, { AudioState } from '../../AudioModal/AudioModal';
import SideMenuPanel from '../../ui/SideMenuPanel';
import AudioActions from './AudioActions';

function AudioToolPanel() {
  const { state, dispatch } = EditorContainer.useContainer();
  const { userPlan, userPlanInfo } = UserContainer.useContainer();
  const [isTrimModalVisible, setTrimModalVisible] = useState(false);
  const [audio, setAudio] = useState<AudioState>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFree = userPlan.plan === Plan.Free;

  useEffect(() => {
    if (!isTrimModalVisible) {
      setAudio((audio) => {
        // Sync audio from state if changed and local remove blob urls
        if (audio && audio.url !== state.audio?.url) {
          URL.revokeObjectURL(audio.url);
          return state.audio;
        }
        return audio;
      });
    }
  }, [isTrimModalVisible, state.audio]);

  useEffect(() => {
    if (audioRef.current && audio) {
      audioRef.current.load();
    }
  }, [audio]);

  const openTrimModal = () => {
    setTrimModalVisible(true);
  };

  const closeTrimModal = () => {
    setTrimModalVisible(false);
  };

  const handleUploadAudioClick = () => {
    inputRef.current?.click();
  };

  const changeAudioFile = (file?: Blob) => {
    setAudio(
      file
        ? {
            data: file,
            url: URL.createObjectURL(file),
          }
        : undefined
    );
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeAudioFile(e.target.files?.[0]);
  };

  const handleChangeAudio = async (clipBuffer: Blob) => {
    dispatch({
      type: 'add_audio',
      clipBuffer,
      blobUrl: URL.createObjectURL(clipBuffer),
    });
  };

  const handleAudioMetadataLoaded = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    // Automatically open clipping when audio is too long
    if (audio && e.currentTarget.duration > userPlanInfo.durationLimit) {
      openTrimModal();
    } else if (audio) {
      dispatch({
        type: 'add_audio',
        clipBuffer: audio.data,
        blobUrl: audio.url,
      });
    }
  };

  return (
    <SideMenuPanel
      title="Audio"
      actions={
        state.audio ? (
          <AudioActions
            onTrimClick={openTrimModal}
            onEditClick={handleUploadAudioClick}
          />
        ) : undefined
      }
    >
      <AudioModal
        initialAudio={audio}
        onContinue={handleChangeAudio}
        visible={isTrimModalVisible}
        close={closeTrimModal}
      />
      <input
        ref={inputRef}
        type="file"
        onChange={handleChangeFile}
        className="hidden"
        accept="audio/*"
      />
      {audio ? (
        <audio
          ref={audioRef}
          controls
          className="w-full mb-4 focus:outline-none"
          onLoadedMetadata={handleAudioMetadataLoaded}
        >
          <source src={audio.url} type="audio/mp3" />
        </audio>
      ) : (
        <>
          <Button
            type="gray"
            className="mb-2"
            onClick={handleUploadAudioClick}
            icon={UploadOutline}
          >
            Upload audio
          </Button>

          <div className="mb-2 text-xs text-gray-500">
            {isFree && 'Maximum duration is 1 minute for free users. '}You can
            trim an audio file of 50MB or less after uploading it.
          </div>
        </>
      )}
    </SideMenuPanel>
  );
}

export default AudioToolPanel;