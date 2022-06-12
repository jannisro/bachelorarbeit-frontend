export default {


    commonPluginSettings (hoverLabelPrefix) {
        let $this = this;
        let result = {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)'
                },
                title: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        };
        if (hoverLabelPrefix) {
            result.tooltip = {
                callbacks: {
                    label: function(context) {
                        return $this.tooltipLabelSuffix(context, hoverLabelPrefix);
                    }
                }
            }
        }
        return result;
    },


    tooltipLabelSuffix (context, suffix) {
        let label = context.dataset.label || '';
        if (label) {
            label += ': ';
        }
        if (context.parsed.y !== null) {
            label += context.parsed.y + suffix;
        }
        return label;
    },


    primaryEnergyData () {
        return {
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: this.commonPluginSettings(false),
            scales: {
                xAxis: {
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'MW',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' MW';
                        }
                    },
                    grid: {
                        drawBorder: false,
                        color: context => context.tick.value == 0 ? "rgba(255, 255, 255, 0.6)" : "transparent"
                    }
                },
                priceYAxis: {
                    type: 'linear',
                    stacked: false,
                    position: 'right',
                    min: -100,
                    title: {
                        text: 'Price / MWh',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '€';
                        }
                    }
                }
            }
        }
    },


    generationChart () {
        return {
            plugins: this.commonPluginSettings(false),
            scales: {
                xAxis: {
                    stacked: true,
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    type: 'linear',
                    stacked: true,
                }
            }
        }
    },


    secondaryEnergyData () {
        return {
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: this.commonPluginSettings(' MW'),
            scales: {
                xAxis: {
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'MW',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' MW';
                        }
                    },
                    grid: {
                        drawBorder: false,
                        color: context => context.tick.value == 0 ? "rgba(255, 255, 255, 0.6)" : "transparent"
                    }
                }
            }
        }
    },


    weatherOverview () {
        return {
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: this.commonPluginSettings(' %'),
            scales: {
                xAxis: {
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Deviation from overall mean',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        drawBorder: false,
                        color: context => context.tick.value == 0 ? "rgba(255, 255, 255, 0.6)" : "transparent"
                    }
                }
            }
        }
    },


    clouds () {
        return {
            plugins: this.commonPluginSettings(' %'),
            scales: {
                xAxis: {
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Clouds',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        };
    },


    temperature () {
        return {
            plugins: this.commonPluginSettings(' °C'),
            scales: {
                xAxis: {
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Temperature',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '°C';
                        }
                    },
                    grid: {
                        drawBorder: false,
                        color: context => context.tick.value == 0 ? "rgba(255, 255, 255, 0.6)" : "transparent"
                    }
                }
            }
        };
    },


    wind () {
        return {
            plugins: this.commonPluginSettings(' m/s'),
            scales: {
                xAxis: {
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Wind',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'm/s';
                        }
                    }
                }
            }
        };
    },


    rain () {
        return {
            plugins: this.commonPluginSettings(' mm'),
            scales: {
                xAxis: {
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Precipitation',
                        display: true
                    },
                    min: 0,
                    ticks: {
                        callback: function(value) {
                            return value + 'mm';
                        }
                    }
                }
            }
        };
    },


    snow () {
        return this.rain;
    },


    primaryBorderCrossingData () {
        return {
            plugins: this.commonPluginSettings(' MW'),
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                xAxis: {
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'MW',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' MW';
                        }
                    },
                    grid: {
                        drawBorder: false,
                        color: context => context.tick.value == 0 ? "rgba(255, 255, 255, 0.6)" : "transparent"
                    }
                }
            }
        }
    },


    reversedBorderCrossingData () {
        return this.primaryBorderCrossingData();
    }

}