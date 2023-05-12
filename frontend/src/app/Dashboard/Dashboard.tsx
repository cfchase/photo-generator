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
import { HelpIcon } from '@patternfly/react-icons';
import teddy1 from '../../images/dog/teddy1.png';
import teddy2 from '../../images/dog/teddy2.png';
import teddy3 from '../../images/dog/teddy3.png';
import teddy4 from '../../images/dog/teddy4.png';
import teddy5 from '../../images/dog/teddy5.png';
import teddy6 from '../../images/dog/teddy6.png';

import './Dashboard.css';

const Dashboard: React.FunctionComponent = () => {
  const intervalref = React.useRef<number | null>(null);
  const [entry, setEntry] = React.useState('');
  const [inProgress, setInProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [galleryItems, setGalleryItems] = React.useState([] as any[]);
  const [intervalId, setIntervalId] = React.useState(null as any);

  React.useEffect(() => {
    // here's the cleanup function
    console.log({ progress });

    if (progress >= 100) {
      if (intervalref?.current) {
        window.clearInterval(intervalref.current);
      }
      intervalref.current = null;
      setProgress(0);
      setGalleryItems([teddy1, teddy2, teddy3, teddy4, teddy5, teddy6]);
    }
  }, [progress, intervalref]);

  React.useEffect(() => {
    // here's the cleanup function
    return () => {
      if (intervalref.current !== null) {
        window.clearInterval(intervalref.current);
      }
    };
  }, []);

  const handleNameChange = (name: string) => {
    setEntry(name);
  };

  const onSubmit = () => {
    console.log('submit');
    setGalleryItems([]);
    if (intervalref.current !== null) return;
    intervalref.current = window.setInterval(() => {
      setProgress((prevProgress) => prevProgress + 1);
      if (progress > 100) {
        if (intervalref?.current) {
          window.clearInterval(intervalref.current);
        }
        intervalref.current = null;
        setGalleryItems([teddy1, teddy2, teddy3, teddy4, teddy5, teddy6]);
      }
    }, 50);
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

  const renderGallery = () => {
    if (progress > 0 || !galleryItems || galleryItems.length == 0) {
      return null;
    }
    return (
      <>
        <PageSection>
          <Stack hasGutter>
            <StackItem>
              <Split>
                <SplitItem isFilled>
                  <TextContent>
                    <Text component="h1" onClick={() => onSubmit()}>
                      Teddy is {entry}
                    </Text>
                  </TextContent>
                </SplitItem>
                <SplitItem isFilled>
                  <Button variant="primary">Send him somewhere else</Button>
                </SplitItem>
              </Split>
            </StackItem>
          </Stack>
        </PageSection>
        <PageSection>
          <Gallery maxWidths={{ default: '450px' }} role="list" hasGutter>
            {galleryItems.map((g, index) => (
              <GalleryItem key={`gallery-item-${index}`}>
                <img src={g} alt={`dog image ${index}`} />
              </GalleryItem>
            ))}
          </Gallery>
        </PageSection>
      </>
    );
  };

  return (
    <>
      <PageSection style={!galleryItems || galleryItems.length <= 0 ? { display: 'block' } : { display: 'none' }}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <FormGroup isRequired fieldId="simple-form-where-01">
            <TextInput
              isRequired
              type="text"
              id="simple-form-name-01"
              name="simple-form-name-01"
              aria-describedby="simple-form-name-01-helper"
              value={entry}
              onChange={handleNameChange}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              isDisabled={!entry}
              onClick={() => onSubmit()}
              style={!galleryItems || galleryItems.length == 0 ? { display: 'block' } : { display: 'none' }}
            >
              Go!
            </Button>
          </ActionGroup>
        </Form>
      </PageSection>
      <PageSection style={progress > 0 ? { display: 'block' } : { display: 'none' }}>
        <Progress value={progress} title="Sending Teddy..." size={ProgressSize.lg} />
      </PageSection>
      {renderGallery()}
    </>
  );
};

export { Dashboard };
