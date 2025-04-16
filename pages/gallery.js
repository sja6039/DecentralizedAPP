/*
This page will display user uploaded images and captions. 
You can search for specific park images and view just that park.
Images and parks are displayed in a card format for easy viewing.
You can only upload your own images when you are logged in as a user.
*/
import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { storage, db } from '@/backend/Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Navbar from '@/components/Dashboard/Navbar';
import { getAuth } from 'firebase/auth';

const parks = [
  "Acadia",
  "American Samoa",
  "Arches",
  "Badlands",
  "Big Bend",
  "Biscayne",
  "Black Canyon of the Gunnison",
  "Bryce Canyon",
  "Canyonlands",
  "Capitol Reef",
  "Carlsbad Caverns",
  "Channel Islands",
  "Congaree",
  "Crater Lake",
  "Cuyahoga Valley",
  "Death Valley",
  "Denali",
  "Dry Tortugas",
  "Everglades",
  "Gates of the Arctic",
  "Gateway Arch",
  "Glacier",
  "Glacier Bay",
  "Grand Canyon",
  "Grand Teton",
  "Great Basin",
  "Great Sand Dunes",
  "Great Smoky Mountains",
  "Guadalupe Mountains",
  "Haleakalā",
  "Hawaiʻi Volcanoes",
  "Hot Springs",
  "Indiana Dunes",
  "Isle Royale",
  "Joshua Tree",
  "Katmai",
  "Kenai Fjords",
  "Kings Canyon",
  "Kobuk Valley",
  "Lake Clark",
  "Lassen Volcanic",
  "Mammoth Cave",
  "Mesa Verde",
  "Mount Rainier",
  "New River Gorge",
  "North Cascades",
  "Olympic",
  "Petrified Forest",
  "Pinnacles",
  "Redwood",
  "Rocky Mountain",
  "Saguaro",
  "Sequoia",
  "Shenandoah",
  "Theodore Roosevelt",
  "Virgin Islands",
  "Voyageurs",
  "White Sands",
  "Wind Cave",
  "Wrangell-St. Elias",
  "Yellowstone",
  "Yosemite",
  "Zion"
];

export default function GalleryPage() {
  const [selectedPark, setSelectedPark] = useState('All');
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [user, setUser] = useState(null);
  const [expandedCaptions, setExpandedCaptions] = useState({});
  /*
  determines whether the user is logged in or not
  */
  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    fetchImages();
    return () => unsubscribe();
  }, [selectedPark]);
  /*
  fetches all images from firebase storage and captions from firestore.
  filters them so the newest images are displayed first.
  collects the images from the databass.
  */
  const fetchImages = async () => {
    try {
      const imagesCollection = collection(db, 'gallery');
      const imagesSnapshot = await getDocs(imagesCollection);
      let imagesData = [];
      imagesSnapshot.forEach(doc => {
        imagesData.push({ id: doc.id, ...doc.data() });
      });
      if (selectedPark !== 'All') {
        imagesData = imagesData.filter(img => img.park === selectedPark);
      }
      imagesData.sort((a, b) => b.timestamp - a.timestamp);
      setImages(imagesData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  /*
  grabs the image from the input used to update states
  */
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  /*
  This is the main function to handle uploading when a user submmits
  handles validating that all fields are entered and then sets the uploading state
  creates a unique file name to store and then tracks progress with a loading bar
  then cleans up the form and fetches the images again for display
  */
  const handleUpload = async () => {
    if (!image || !caption || !selectedPark || selectedPark === 'All') {
      alert('Please select an image, enter a caption, and choose a specific park');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const fileName = `${Date.now()}_${image.name}`;
      const storageRef = ref(storage, `gallery/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading image:', error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'gallery'), {
            imageUrl: downloadURL,
            caption: caption,
            park: selectedPark,
            uploadedBy: user.uid,
            uploaderName: user.displayName || 'Anonymous',
            timestamp: Date.now()
          });
          setImage(null);
          setCaption('');
          setUploading(false);
          setShowUploadForm(false);
          fetchImages();
        }
      );
    } catch (error) {
      console.error('Error in upload process:', error);
      setUploading(false);
    }
  };
  /*
  this is for images with long captions
  makes it so it doesnt take up large parts of the page and displays a read more option.
  */
  const toggleCaption = (imageId) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };
  
  return (
    <Container>
      <Navbar />
      <BackgroundLayer>
        <Content>

          <PageHeader>
            <HeaderTitle>National Parks Gallery</HeaderTitle>
            <FilterContainer>
              <FilterLabel htmlFor="parkFilter">Filter by Park: </FilterLabel>
              <Select 
                id="parkFilter" 
                value={selectedPark} 
                onChange={(e) => setSelectedPark(e.target.value)}
              >
                <option value="All">All Parks</option>
                {parks.map(park => (
                  <option key={park} value={park}>{park}</option>
                ))}
              </Select>
            </FilterContainer>
          </PageHeader>

          {user && (
            <UploadSection>
              {!showUploadForm ? (
                <UploadButton onClick={() => setShowUploadForm(true)}>
                  <PlusIcon>+</PlusIcon> Add Photo
                </UploadButton>
              ) : (
                <UploadForm>
                  <UploadFormTitle>Upload a new photo</UploadFormTitle>
                  <FormGroup>
                    <FormLabel>Select Park:</FormLabel>
                    <Select 
                      value={selectedPark === 'All' ? '' : selectedPark} 
                      onChange={(e) => setSelectedPark(e.target.value)}
                    >
                      <option value="">Select a park</option>
                      {parks.map(park => (
                        <option key={park} value={park}>{park}</option>
                      ))}
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Image:</FormLabel>
                    <FileInput 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Caption:</FormLabel>
                    <TextInput
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Enter a caption"
                    />
                  </FormGroup>
                  
                  {uploading ? (
                    <ProgressContainer>
                      <ProgressBarContainer>
                        <ProgressBar progress={uploadProgress} />
                      </ProgressBarContainer>
                      <ProgressText>{uploadProgress}%</ProgressText>
                    </ProgressContainer>
                  ) : (
                    <ButtonGroup>
                      <SubmitButton onClick={handleUpload}>Upload</SubmitButton>
                      <CancelButton onClick={() => setShowUploadForm(false)}>
                        Cancel
                      </CancelButton>
                    </ButtonGroup>
                  )}
                </UploadForm>
              )}
            </UploadSection>
          )}
          
          {images.length > 0 ? (

            <Gallery>
              {images.map(img => (
                <ImageCard key={img.id}>
                  <ImageContainer>
                    <GalleryImage src={img.imageUrl} alt={img.caption} />
                  </ImageContainer>
                  <ImageCaption>
                    {img.caption.length > 60 ? (
                      <>
                        <CaptionText expanded={expandedCaptions[img.id]}>
                          {expandedCaptions[img.id] ? img.caption : `${img.caption.substring(0, 60)}...`}
                        </CaptionText>
                        <ReadMoreButton onClick={() => toggleCaption(img.id)}>
                          {expandedCaptions[img.id] ? 'Show less' : 'Read more'}
                        </ReadMoreButton>
                      </>
                    ) : (
                      <CaptionText>{img.caption}</CaptionText>
                    )}
                    <ParkName>{img.park}</ParkName>
                  </ImageCaption>
                </ImageCard>
              ))}
            </Gallery>

          ) : (
            <NoImages>
              {selectedPark === 'All' 
                ? 'No images have been uploaded yet.' 
                : `No images for ${selectedPark} have been uploaded yet.`}
            </NoImages>
          )}
        </Content>
      </BackgroundLayer>
    </Container>
  );
}

const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #A3D1C6;
  color: #003D2E;
`;

const BackgroundLayer = styled.div`
  flex: 1;
  background-color: #A3D1C6;
  background-image: radial-gradient(#FBFFE4, rgba(251, 255, 228, 0.8));
  overflow-y: auto;
`;

const Content = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #005D4B;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #003D2E;
  margin: 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 40px;
    height: 4px;
    background-color: #005D4B;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #003D2E;
  padding: 0.75rem 1rem;
  border-radius: 8px;
`;

const FilterLabel = styled.label`
  color: #FBFFE4;
  font-weight: 600;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  background-color: #FBFFE4;
  color: #003D2E;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  
  &:focus {
    box-shadow: 0 0 0 2px #005D4B;
  }
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const ImageCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 61, 46, 0.15);
  transition: all 0.3s ease;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 61, 46, 0.2);
  }
`;

const ImageContainer = styled.div`
  height: 220px;
  overflow: hidden;
  position: relative;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageCaption = styled.div`
  padding: 1.2rem;
  background: white;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border-top: 4px solid #005D4B;
`;

const CaptionText = styled.p`
  margin: 0 0 0.7rem 0;
  font-size: 1.1rem;
  color: #003D2E;
  font-weight: 500;
  max-height: ${props => props.expanded ? 'none' : '4.5rem'};
  overflow: ${props => props.expanded ? 'visible' : 'hidden'};
  text-overflow: ellipsis;
  transition: max-height 0.3s ease;
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: #005D4B;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
  text-decoration: underline;
  margin-bottom: 0.7rem;
  
  &:hover {
    color: #003D2E;
  }
`;

const ParkName = styled.small`
  color: #005D4B;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.8rem;
  margin-top: auto;
`;

const NoImages = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  color: #005D4B;
  background-color: rgba(0, 93, 75, 0.05);
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 500;
`;

const UploadSection = styled.div`
  margin-bottom: 3rem;
`;

const UploadButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #005D4B;
  color: #FBFFE4;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 61, 46, 0.15);
  
  &:hover {
    background-color: #003D2E;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 61, 46, 0.2);
  }
`;

const PlusIcon = styled.span`
  font-size: 1.4rem;
  line-height: 1;
`;

const UploadForm = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  max-width: 600px;
  box-shadow: 0 8px 20px rgba(0, 61, 46, 0.15);
  border-left: 6px solid #005D4B;
`;

const UploadFormTitle = styled.h3`
  color: #003D2E;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background-color: #005D4B;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #003D2E;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  font-family: inherit;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #005D4B;
    box-shadow: 0 0 0 2px rgba(0, 93, 75, 0.1);
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 6px;
  background-color: rgba(0, 93, 75, 0.05);
  font-family: inherit;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: inherit;
`;

const SubmitButton = styled(Button)`
  background-color: #005D4B;
  color: #FBFFE4;
  flex: 1;
  
  &:hover {
    background-color: #003D2E;
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 2px solid #005D4B;
  color: #005D4B;
  
  &:hover {
    background-color: rgba(0, 93, 75, 0.1);
  }
`;

const ProgressContainer = styled.div`
  margin-top: 2rem;
`;

const ProgressBarContainer = styled.div`
  height: 12px;
  background-color: rgba(0, 93, 75, 0.1);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.progress}%;
  background-color: #005D4B;
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-weight: 600;
  color: #005D4B;
`;