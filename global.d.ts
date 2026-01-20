/**
 * @file Глобальні типи для AI Studio та Google Maps
 * @author Ілля Чернов (SmileAfterBurn)
 */

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  namespace google {
    namespace maps {
      export type Map = any;
      export type Marker = any;
      export type Animation = any;
      export type Size = any;
      export type Point = any;
      namespace journeySharing {
        export class JourneySharingMapView {
          constructor(options: any);
          map: google.maps.Map;
        }
        export class TripLocationProvider {
          constructor(options: any);
          tripId: string;
        }
      }
    }
  }

  interface Window {
    aistudio?: AIStudio;
    google: any;
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    process?: {
      env: {
        API_KEY: string;
        [key: string]: string;
      }
    };
  }
}

export {};