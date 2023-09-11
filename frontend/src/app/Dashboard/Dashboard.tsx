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
import airplane1 from '../../images/airplane/1.jpg';
import airplane2 from '../../images/airplane/2.jpg';
import airplane3 from '../../images/airplane/3.jpg';
import airplane4 from '../../images/airplane/4.jpg';
import airplane5 from '../../images/airplane/5.jpg';
import airplane6 from '../../images/airplane/6.jpg';

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
      setGalleryItems([airplane1, airplane2, airplane3, airplane4, airplane5, airplane6]);
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
        setGalleryItems([airplane1, airplane2, airplane3, airplane4, airplane5, airplane6]);
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
                  <Button component="a" href="/" variant="primary">
                    New
                  </Button>{' '}
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
        <Progress value={progress} title="Generating..." size={ProgressSize.lg} />
      </PageSection>
      {renderGallery()}
    </>
  );
};

export { Dashboard };
