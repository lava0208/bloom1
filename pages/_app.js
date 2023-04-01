import "../styles/globals.scss";
import "~styles/bigcalendar.scss";
import "weather-icons/css/weather-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import PageHead from "~components/PageHead";
import swal from 'sweetalert';
import { LoadingProvider } from '../contexts/loadingContext';

function MyApp({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <PageHead />
      <Component {...pageProps} />
      </LoadingProvider>
  );
}

export default MyApp;