import "./App.css";
import { AiOutlineSearch } from "react-icons/ai";
import { SiWindicss } from "react-icons/si";
import { WiHumidity } from "react-icons/wi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { DotLoader } from "react-spinners";
import axios from "axios";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { useEffect, useState } from "react";

type WeatherDataType = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  wind: {
    speed: number;
  };
  weather: {
    main: string;
  }[];
};

function App() {
  const API_KEY = "425a8809619bd006f8ccf55810c828c7";
  const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/";
  const [weatherData, setWeatherData] = useState<WeatherDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>("");

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${API_ENDPOINT}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const resp = await axios.get(url);
    return resp.data;
  };

  const fetchCityData = async (city: string) => {
    try {
      const url = `${API_ENDPOINT}weather?q=${city}&appid=${API_KEY}&units=metric`;
      const resp = await axios.get(url);

      const currentWeatherData: WeatherDataType = resp.data;
      return { currentWeatherData };
    } catch (error) {
      console.error("No Data Found");
      throw error;
    }
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return;
    }
    try {
      const { currentWeatherData } = await fetchCityData(searchCity);
      setWeatherData(currentWeatherData);
    } catch (error) {
      console.log("No Results Found");
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
        ([currnetWeather]) => {
          setIsLoading(true);
          setWeatherData(currnetWeather);
        }
      );
    });
  }, []);

  const changeIcon = (weather: string) => {
    let iconElement: React.ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill size={150} />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsFillSunFill size={150} />;
        iconColor = "#FFC436";
        break;

      case "Clouds":
        iconElement = <BsCloudyFill size={150} />;
        iconColor = "#102C57";
        break;
      case "Mist":
        iconElement = <BsCloudFog2Fill size={150} />;
        iconColor = "#279EFF";
        break;

      default:
        iconElement = <TiWeatherPartlySunny size={150} />;
        iconColor = "#7B2869";
    }
    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  return (
    <div className="grid h-screen justify-center items-center text-center">
      <div className="container border-2 border-gray-400 py-4 px-4 rounded-xl drop-shadow-xl">
        <div className="search flex gap-4 my-3 justify-center">
          <input
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="border-2 border-gray-400 rounded-full px-2 bg-transparent"
            type="text"
            placeholder="Search City"
          />
          <div
            onClick={handleSearch}
            className="border-2 border-gray-400 rounded-full px-1 py-1 w-fit cursor-pointer"
          >
            <AiOutlineSearch />
          </div>
        </div>
        {weatherData && isLoading ? (
          <div className="middle flex flex-col gap-6 items-center">
            <div>
              <h1 className="text-3xl">{weatherData.name}</h1>
              <span>{weatherData.sys.country}</span>
            </div>
            <div>{changeIcon(weatherData.weather[0].main)}</div>
            <div>
              <h1 className="text-3xl">{weatherData.main.temp}&deg;C</h1>
              <h2 className="text-xl">Clouds</h2>
            </div>
            <div className="botttom-container flex gap-6 mt-7">
              <div className="humidity flex items-center">
                <WiHumidity size={50} />
                <div>
                  <h2>{weatherData.main.humidity}%</h2>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="windSpeed flex items-center">
                <SiWindicss size={40} />
                <div>
                  <h2>{weatherData.wind.speed}km/h</h2>
                  <p>Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <DotLoader size={70} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
