import * as React from 'react';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Gallery,
  GalleryItem,
  PageSection,
  Popover,
  Progress,
  ProgressSize,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextContent,
  TextInput,
  Text,
  Title,
} from '@patternfly/react-core';

import './Album.css';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { GEN_PHRASE } from '../../constants';

interface Prediction {
  id: string;
  images: [
    {
      file: string;
      progress: number;
      status: string;
    }
  ];
  prompt: string;
}

const Album: React.FunctionComponent = () => {
  const intervalref = React.useRef<number | null>(null);
  const [entry, setEntry] = React.useState('');
  const [prediction, setPrediction] = React.useState(null as Prediction | null);
  const [inProgress, setInProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [galleryItems, setGalleryItems] = React.useState([] as any[]);
  const [intervalId, setIntervalId] = React.useState(null as any);
  const { id } = useParams() as { id: string };
  const history = useHistory();

  async function getAlbum(id: string): Promise<void> {
    if (!id) {
      return;
    }

    const response = await fetch(`/api/predictions/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const responseJson = await response.json();
    setPrediction(responseJson);
    setProgress(responseJson.images?.[0]?.progress);
    setGalleryItems(responseJson.images);
    return responseJson;
  }

  React.useEffect(() => {
    // here's the cleanup function
    console.log({ progress });

    if (progress >= 100) {
      if (intervalref?.current) {
        window.clearInterval(intervalref.current);
      }
      intervalref.current = null;
    }
  }, [progress, intervalref]);

  React.useEffect(() => {
    getAlbum(id);

    return () => {
      if (intervalref.current !== null) {
        window.clearInterval(intervalref.current);
      }
    };
  }, []);

  const handleNameChange = (name: string) => {
    setEntry(name);
  };

  const handleClick = () => {
    const newIntervalId = setInterval(() => {
      console.log('timer triggered');
      setProgress(() => progress + 1);
    }, 1000);
    setIntervalId(newIntervalId);
  };
  const handleStopClick = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const handleReset = () => {
    history.push('/');
  };

  const renderProgress = () => {
    return (
      <PageSection style={progress >= 0 && progress < 100 ? { display: 'block' } : { display: 'none' }}>
        <Progress value={progress} title="Sending Teddy..." size={ProgressSize.lg} />
      </PageSection>
    );
  };

  const renderGallery = () => {
    if (progress < 100 || !galleryItems || galleryItems.length == 0) {
      return null;
    }
    return (
      <>
        <PageSection>
          <Stack hasGutter>
            <StackItem>
              <TextContent>
                <Text component="h1">Teddy is {prediction?.prompt?.replace(GEN_PHRASE, '')}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Button variant="primary" onClick={() => handleReset()}>
                Send him somewhere else
              </Button>
            </StackItem>
          </Stack>
        </PageSection>
        <PageSection>
          <Gallery maxWidths={{ default: '512px' }} role="list" hasGutter>
            {galleryItems.map((g, index) => (
              <GalleryItem key={`gallery-item-${index}`}>
                {g.status == 'COMPLETE' ? <img src={g.file} alt={`dog image ${index}`} /> : ''}
              </GalleryItem>
            ))}
          </Gallery>
        </PageSection>
      </>
    );
  };

  return (
    <>
      {renderProgress()}
      {renderGallery()}
    </>
  );
};

export { Album };
