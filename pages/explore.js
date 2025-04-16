/*
This page includes both of my APIS displys a map where you can find the locations of parks with markers.
A list of all 63 national parks will be displayed on the side where the user when signed in can mark the parks they have visited.
When clicking a park it will take you to that marker, give a link to the website, give directions, and show activities available at that park.
Dynamic map that will show the markers turned green once visited
*/
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import React, { useState, useEffect } from 'react';

export default function Explore() {
    const [parks, setParks] = useState({});
    const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 });
    const [zoom, setZoom] = useState(4);
    const [selectedPark, setSelectedPark] = useState(null);
    const [parkActivities, setParkActivities] = useState([]);
    const [user, setUser] = useState(null);
    const [visitedParks, setVisitedParks] = useState([]);
    /*
    used to track when user is logged in or not
    UI has a few changes when user is logged in
    need to load visited parks once a user is active
    */

    /*
    loading the parks that the user has marked as visited
    grabs their array from the db or creates an empty one if there is none
    works by getting a reference to the user doc and then updating the data
    */
    const loadVisitedParks = async (userId) => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().visitedParks) {
          setVisitedParks(userDoc.data().visitedParks);
        } else {
          await setDoc(userDocRef, { visitedParks: [] });
          setVisitedParks([]);
        }
      } catch (error) {
        console.error("Error loading visited parks:", error);
        setVisitedParks([]);
      }
    };
    /*
    toggles visited and not visited parks, updates the array in firebase
    gets the user doc refernce and then cahnges status, works for marking parks as visited or not visited
    */
    const toggleVisitedPark = async (parkCode) => {
      try {
        const userDocRef = doc(db, "users", user.uid);       
        if (visitedParks.includes(parkCode)) {
          await updateDoc(userDocRef, {
            visitedParks: arrayRemove(parkCode)
          });
          setVisitedParks(prev => prev.filter(code => code !== parkCode));
        } else {
          await updateDoc(userDocRef, {
            visitedParks: arrayUnion(parkCode)
          });
          setVisitedParks(prev => [...prev, parkCode]);
        }
      } catch (error) {
        console.error("Error updating visited parks:", error);
        alert("Failed to update your visited parks. Please try again.");
      }
    };
    useEffect(() => {
      setParks({
        "Alaska": [
          { name: "Denali National Park", location: { lat: 63.33, lng: -150.50 }, parkCode: "dena" },
          { name: "Gates of the Arctic National Park", location: { lat: 67.78, lng: -153.30 }, parkCode: "gaar" },
          { name: "Glacier Bay National Park", location: { lat: 58.50, lng: -137.00 }, parkCode: "glba" },
          { name: "Katmai National Park", location: { lat: 58.50, lng: -155.00 }, parkCode: "katm" },
          { name: "Kenai Fjords National Park", location: { lat: 59.92, lng: -149.65 }, parkCode: "kefj" },
          { name: "Kobuk Valley National Park", location: { lat: 67.33, lng: -159.12 }, parkCode: "kova" },
          { name: "Lake Clark National Park", location: { lat: 60.97, lng: -153.42 }, parkCode: "lacl" },
          { name: "Wrangell-St. Elias National Park", location: { lat: 61.00, lng: -142.00 }, parkCode: "wrst" },
        ],
        "Arizona": [
          { name: "Grand Canyon National Park", location: { lat: 36.06, lng: -112.14 }, parkCode: "grca" },
          { name: "Petrified Forest National Park", location: { lat: 35.07, lng: -109.78 }, parkCode: "pefo" },
          { name: "Saguaro National Park", location: { lat: 32.25, lng: -110.50 }, parkCode: "sagu" },
        ],
        "Arkansas": [
          { name: "Hot Springs National Park", location: { lat: 34.51, lng: -93.05 }, parkCode: "hosp" },
        ],
        "California": [
          { name: "Channel Islands National Park", location: { lat: 34.01, lng: -119.42 }, parkCode: "chis" },
          { name: "Death Valley National Park", location: { lat: 36.24, lng: -116.82 }, parkCode: "deva" },
          { name: "Joshua Tree National Park", location: { lat: 33.79, lng: -115.90 }, parkCode: "jotr" },
          { name: "Kings Canyon National Park", location: { lat: 36.80, lng: -118.55 }, parkCode: "kica" },
          { name: "Lassen Volcanic National Park", location: { lat: 40.49, lng: -121.51 }, parkCode: "lavo" },
          { name: "Pinnacles National Park", location: { lat: 36.48, lng: -121.16 }, parkCode: "pinn" },
          { name: "Redwood National Park", location: { lat: 41.30, lng: -124.00 }, parkCode: "redw" },
          { name: "Sequoia National Park", location: { lat: 36.43, lng: -118.68 }, parkCode: "sequ" },
          { name: "Yosemite National Park", location: { lat: 37.86, lng: -119.53 }, parkCode: "yose" },
        ],
        "Colorado": [
          { name: "Black Canyon of the Gunnison National Park", location: { lat: 38.57, lng: -107.72 }, parkCode: "blca" },
          { name: "Great Sand Dunes National Park", location: { lat: 37.73, lng: -105.51 }, parkCode: "grsa" },
          { name: "Mesa Verde National Park", location: { lat: 37.18, lng: -108.49 }, parkCode: "meve" },
          { name: "Rocky Mountain National Park", location: { lat: 40.40, lng: -105.58 }, parkCode: "romo" },
        ],
        "Florida": [
          { name: "Biscayne National Park", location: { lat: 25.65, lng: -80.08 }, parkCode: "bisc" },
          { name: "Dry Tortugas National Park", location: { lat: 24.63, lng: -82.87 }, parkCode: "drto" },
          { name: "Everglades National Park", location: { lat: 25.32, lng: -80.93 }, parkCode: "ever" },
        ],
        "Hawaii": [
          { name: "Haleakalā National Park", location: { lat: 20.72, lng: -156.17 }, parkCode: "hale" },
          { name: "Hawaiʻi Volcanoes National Park", location: { lat: 19.38, lng: -155.20 }, parkCode: "havo" },
        ],
        "Indiana": [
          { name: "Indiana Dunes National Park", location: { lat: 41.65, lng: -87.05 }, parkCode: "indu" },
        ],
        "Kentucky": [
          { name: "Mammoth Cave National Park", location: { lat: 37.18, lng: -86.10 }, parkCode: "maca" },
        ],
        "Maine": [
          { name: "Acadia National Park", location: { lat: 44.35, lng: -68.21 }, parkCode: "acad" },
        ],
        "Michigan": [
          { name: "Isle Royale National Park", location: { lat: 48.10, lng: -88.55 }, parkCode: "isro" },
        ],
        "Minnesota": [
          { name: "Voyageurs National Park", location: { lat: 48.50, lng: -92.88 }, parkCode: "voya" },
        ],
        "Missouri": [
          { name: "Gateway Arch National Park", location: { lat: 38.63, lng: -90.19 }, parkCode: "jeff" },
        ],
        "Montana": [
          { name: "Glacier National Park", location: { lat: 48.80, lng: -114.00 }, parkCode: "glac" },
        ],
        "Nevada": [
          { name: "Great Basin National Park", location: { lat: 38.98, lng: -114.30 }, parkCode: "grba" },
        ],
        "New Mexico": [
          { name: "Carlsbad Caverns National Park", location: { lat: 32.17, lng: -104.44 }, parkCode: "cave" },
          { name: "White Sands National Park", location: { lat: 32.78, lng: -106.17 }, parkCode: "whsa" },
        ],
        "North Carolina / Tennessee": [
          { name: "Great Smoky Mountains National Park", location: { lat: 35.68, lng: -83.53 }, parkCode: "grsm" },
        ],
        "North Dakota": [
          { name: "Theodore Roosevelt National Park", location: { lat: 46.97, lng: -103.00 }, parkCode: "thro" },
        ],
        "Ohio": [
          { name: "Cuyahoga Valley National Park", location: { lat: 41.24, lng: -81.55 }, parkCode: "cuva" },
        ],
        "Oregon": [
          { name: "Crater Lake National Park", location: { lat: 42.94, lng: -122.10 }, parkCode: "crla" },
        ],
        "South Carolina": [
          { name: "Congaree National Park", location: { lat: 33.78, lng: -80.78 }, parkCode: "cong" },
        ],
        "South Dakota": [
          { name: "Badlands National Park", location: { lat: 43.75, lng: -102.50 }, parkCode: "badl" },
          { name: "Wind Cave National Park", location: { lat: 43.57, lng: -103.48 }, parkCode: "wica" },
        ],
        "Texas": [
          { name: "Big Bend National Park", location: { lat: 29.25, lng: -103.25 }, parkCode: "bibe" },
          { name: "Guadalupe Mountains National Park", location: { lat: 31.92, lng: -104.87 }, parkCode: "gumo" },
        ],
        "Utah": [
          { name: "Arches National Park", location: { lat: 38.68, lng: -109.57 }, parkCode: "arch" },
          { name: "Bryce Canyon National Park", location: { lat: 37.57, lng: -112.18 }, parkCode: "brca" },
          { name: "Canyonlands National Park", location: { lat: 38.20, lng: -109.93 }, parkCode: "cany" },
          { name: "Capitol Reef National Park", location: { lat: 38.20, lng: -111.17 }, parkCode: "care" },
          { name: "Zion National Park", location: { lat: 37.30, lng: -113.05 }, parkCode: "zion" },
        ],
        "Virgin Islands": [
          { name: "Virgin Islands National Park", location: { lat: 18.33, lng: -64.73 }, parkCode: "viis" },
        ],
        "Virginia": [
          { name: "Shenandoah National Park", location: { lat: 38.53, lng: -78.35 }, parkCode: "shen" },
        ],
        "Washington": [
          { name: "Mount Rainier National Park", location: { lat: 46.85, lng: -121.75 }, parkCode: "mora" },
          { name: "North Cascades National Park", location: { lat: 48.70, lng: -121.20 }, parkCode: "noca" },
          { name: "Olympic National Park", location: { lat: 47.97, lng: -123.50 }, parkCode: "olym" },
        ],
        "West Virginia": [
          { name: "New River Gorge National Park", location: { lat: 37.90, lng: -81.05 }, parkCode: "neri" },
        ],
        "Wyoming": [
          { name: "Grand Teton National Park", location: { lat: 43.73, lng: -110.80 }, parkCode: "grte" },
          { name: "Yellowstone National Park", location: { lat: 44.60, lng: -110.50 }, parkCode: "yell" },
        ],
        "American Samoa": [
          { name: "National Park of American Samoa", location: { lat: -14.25, lng: -170.68 }, parkCode: "npsa" },
        ]
      });
    }, []);
    /*
    using NPS api grabs all the activites at the selected park
    NPS api returns the park detials and then update our array to display the activities
    */
    const fetchParkActivities = async (parkCode) => {
      try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${NPSApiKey}`);
        const data = await response.json();
        setParkActivities(data.data[0].activities || []);
      } catch (error) {
        console.error("Error fetching park activities:", error);
        setParkActivities([]);
      }
    };
    /*
    simple function to handle when a park is clicked
    takes us to the pin setting a predetermind zoom
    then fetches park activities to display
    */
    function clickPark(park) {
      setMapCenter(park.location);
      setZoom(7.5);
      setSelectedPark(park);
      
      if (park.parkCode) {
        fetchParkActivities(park.parkCode);
      }
    }
    /*
    calcaultes the percentage of parks visited
    */
    const getVisitedStats = () => {
      if (!user) return { total: 0, percentage: 0 };  
      const totalParks = Object.values(parks).flat().length;
      const visitedCount = visitedParks.length;
      const percentage = totalParks > 0 ? ((visitedCount / totalParks) * 100).toFixed(1) : 0;
      return { total: visitedCount, percentage, totalParks };
    };
  
    return (
      <Container>
        <Navbar /> 
        <MainContent>
          <Sidebar>
            {user && (
              <VisitedStats>

                <h3>My Park Visits</h3>
                <p>You've visited {getVisitedStats().total} out of {getVisitedStats().totalParks} parks ({getVisitedStats().percentage}%)</p>
              </VisitedStats>
            )}

            <StateList>
              {Object.keys(parks).length > 0 && 
                Object.keys(parks).sort().map((state) => (
                  <StateGroup key={state}>
                    <StateHeader>{state}</StateHeader>
                    <StateParks>
                      {parks[state].map((park, idx) => (
                        <ParkItem 
                          key={idx} 
                          onClick={() => clickPark(park)}
                          className={selectedPark && selectedPark.name === park.name ? 'selected' : ''}
                        >
                          <ParkItemContent>
                            {user && (
                              <CheckboxContainer 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVisitedPark(park.parkCode);
                                }}
                                isVisited={visitedParks.includes(park.parkCode)}
                              >
                                <ParkCheckbox 
                                  type="checkbox" 
                                  checked={visitedParks.includes(park.parkCode)} 
                                  readOnly
                                />
                                <CheckMark isVisited={visitedParks.includes(park.parkCode)} />
                              </CheckboxContainer>
                            )}
                            <ParkName>{park.name}</ParkName>
                          </ParkItemContent>
                        </ParkItem>
                      ))}
                    </StateParks>
                  </StateGroup>
                ))
              }
            </StateList>

          </Sidebar>


          {selectedPark && (
            <ActivitiesPanel>
              <ActivitiesHeader>
                <h2>{selectedPark.name}</h2>
                {user && (
                  <VisitStatusBadge isVisited={visitedParks.includes(selectedPark.parkCode)}>
                    {visitedParks.includes(selectedPark.parkCode) ? "✓ Visited" : "Not Visited"}
                  </VisitStatusBadge>
                )}
              </ActivitiesHeader>
              <ActivitiesList>
                <h3>Available Activities</h3>
                {parkActivities.length > 0 ? (
                  <ul>
                    {parkActivities.map((activity, idx) => (
                      <ActivityItem key={idx}>
                        {activity.name}
                      </ActivityItem>
                    ))}
                  </ul>
                ) : (
                  <NoActivitiesMessage>No activities found for this park.</NoActivitiesMessage>
                )}
              </ActivitiesList>
            </ActivitiesPanel>
          )}
        </MainContent>
      </Container>
    );
  }
  
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
  `;
  
  const MainContent = styled.div`
    display: flex;
    flex-grow: 1;
  `;
  
  const Sidebar = styled.div`
    width: 300px;
    font: 1rem 'Roboto', sans-serif;
    background-color: #A3D1C6;
    padding: 20px;
    overflow-y: auto;
    height: calc(100vh - 60px);
    color: #FBFFE4;
  `;
  
  const StateList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
  `;

  const StateGroup = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;
    background-color: rgba(251, 255, 228, 0.1);
  `;

  const StateHeader = styled.div`
    background-color: #003D2E;
    color: #FBFFE4;
    padding: 10px 12px;
    font-weight: bold;
  `;

  const StateParks = styled.ul`
    list-style-type: none;
    padding: 7px 0;
    margin: 0;
  `;
  
  const ParkItem = styled.li`
    padding: 6px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(251, 255, 228, 0.2);
    }

    &.selected {
      background-color: #005D4B;
      font-weight: bold;
    }
  `;

  const ParkItemContent = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  const ParkName = styled.span`
    flex: 1;
  `;

  const CheckboxContainer = styled.div`
    position: relative;
    display: inline-block;
    height: 20px;
    width: 20px;
    background: ${props => props.isVisited ? '#005D4B' : 'rgba(251, 255, 228, 0.3)'};
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    
    &:hover {
      background: ${props => props.isVisited ? '#00836B' : 'rgba(251, 255, 228, 0.5)'};
    }
  `;

  const ParkCheckbox = styled.input`
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
    cursor: pointer;
  `;

  const CheckMark = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    
    &:after {
      content: "";
      position: absolute;
      display: ${props => props.isVisited ? 'block' : 'none'};
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }
  `;

  const VisitedStats = styled.div`
    background-color: #003D2E;
    color: #FBFFE4;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 18px;
    }
    
    p {
      margin: 0;
      font-size: 14px;
    }
  `;
  
  const MapContainer = styled.div`
    flex-grow: 1;
    position: relative;
    height: 100%;
  `;

  const EnhancedInfoContent = styled.div`
    width: 300px;
    background-color: #FBFFE4;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 61, 46, 0.2);
    overflow: hidden;
    font-family: 'Roboto', sans-serif;
    border: none;
  `;

  const ParkTitle = styled.h3`
    margin: 0;
    padding: 16px;
    background-color: #003D2E;
    color: #FBFFE4;
    font-size: 16px;
    text-align: center;
  `;

  const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
  `;

  const NPSButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #003D2E;
    color: #FBFFE4;
    text-decoration: none;
    font-weight: bold;
    padding: 12px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #005D4B;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  const DirectionsButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #A3D1C6;
    color: #003D2E;
    text-decoration: none;
    font-weight: bold;
    padding: 10px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #8DC1B6;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  `;

  const VisitButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.isVisited ? '#D17A22' : '#00836B'};
    color: #FBFFE4;
    border: none;
    font-weight: bold;
    padding: 12px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: ${props => props.isVisited ? '#B05E0C' : '#00A389'};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  const ActivitiesPanel = styled.div`
    width: 280px;
    background-color: #A3D1C6;
    color: #003D2E;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #003D2E;
    overflow-y: auto;
    height: calc(100vh - 60px);
  `;

  const ActivitiesHeader = styled.div`
    background-color: #003D2E;
    color: #FBFFE4;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    h2 {
      margin: 0;
      font-size: 18px;
    }
  `;

  const VisitStatusBadge = styled.div`
    display: inline-block;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    background-color: ${props => props.isVisited ? '#00836B' : '#A3D1C6'};
    color: ${props => props.isVisited ? '#FBFFE4' : '#003D2E'};
    align-self: flex-start;
  `;

  const ActivitiesList = styled.div`
    padding: 15px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 15px;
      border-bottom: 2px solid #A3D1C6;
      padding-bottom: 8px;
      color: #003D2E;
    }
    
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
  `;

  const ActivityItem = styled.li`
    padding: 8px 12px;
    margin-bottom: 6px;
    color: #003D2E;
    &:last-child {
      margin-bottom: 0;
    }
  `;

  const NoActivitiesMessage = styled.p`
    color: #003D2E;
    padding: 10px;
    background-color: rgba(163, 209, 198, 0.2);
    border-radius: 4px;
    text-align: center;
  `;