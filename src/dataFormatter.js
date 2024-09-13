module.exports = dataFormatters = {
  EvacuationShelter: (item) => ({
    Identification: item.Identification.value,
    HazardType: item.HazardType.value,
    NumberOfEvacuees: item.NumberOfEvacuees.value,
    SiteArea: item.SiteArea.value,
    Capacity: item.Capacity.value,
    Status: item.Status.value,
    ReportingTime: item.ReportingTime.value
  }),

  EvacuationInformationSediment: (item) => ({
    AlertLevel: item.AlertLevel.value,
    Identification: item.Identification.value
  }),

  EvacuationInformationFlood: (item) => ({
    AlertLevel: item.AlertLevel.value,
    Identification: item.Identification.value
  }),

  EvacuationInformationStormSurge: (item) => ({
    AlertLevel: item.AlertLevel.value,
    Identification: item.Identification.value
  }),

  EvacuationInformationEarthquake: (item) => ({
    AlertLevel: item.AlertLevel.value,
    Identification: item.Identification.value
  }),

  EvacuationInformationTsunami: (item) => ({
    AlertLevel: item.AlertLevel.value,
    Identification: item.Identification.value
  }),

  EvacuationInformationNuclearPower: (item) => ({
    AlertLevel: item.AlertLevel.value,
    Identification: item.Identification.value
  }),

  UnderpassInformation: (item) => ({
    Identification: item.Identification.value,
    Location: {
      type: item.Location.value.type,
      coordinates: item.Location.value.coordinates
    },
    Status: item.Status.value
  }),

  PrecipitationGauge: (item) => ({
    Identification: item.Identification.value,
    Location: {
      type: item.Location.value.type,
      coordinates: item.Location.value.coordinates
    },
    Precipitation: item.Precipitation.value,
    Precipitation10min: item.Precipitation10min.value,
    Precipitation1hr: item.Precipitation1hr.value,
    PrecipitationLevel1hr: item.PrecipitationLevel1hr.value
  }),

  StreamGauge: (item) => ({
    Identification: item.Identification.value,
    Location: {
      type: item.Location.value.type,
      coordinates: item.Location.value.coordinates
    },
    StreamGauge: item.StreamGauge.value,
    StreamGaugeLevel: item.StreamGaugeLevel.value,
    StreamGaugeType: item.StreamGaugeType.value
  }),

  WeatherForecast: (item) => ({
    Identification: item.Identification.value,
    WeatherType: item.WeatherType.value,
    WeatherTypeTomorrow: item.WeatherTypeTomorrow.value
  }),

  WeatherAlert: (item) => ({
    Identification: item.Identification.value,
    SubCategory: item.SubCategory.value,
    AlertSource: item.AlertSource.value,
    AlertStatus: item.AlertStatus.value,
    AlertType: item.AlertType.value,
    Category: item.Category.value,
    DateIssued: item.DateIssued.value
  }),

  RestrictedTrafficArea: (item) => ({
    Identification: item.Identification.value,
    Reason: item.Reason.value,
    Regulation: item.Regulation.value,
    RegulationStatus: item.RegulationStatus.value,
    ValidityEndDate: item.ValidityEndDate.value,
    ValidityStartDate: item.ValidityStartDate.value
  }),

  DisasterMail: (item) => ({
    Identification: item.Identification.value,
    Main: item.Main.value,
    SendDate: item.SendDate.value,
    Title: item.Title.value
  })
};