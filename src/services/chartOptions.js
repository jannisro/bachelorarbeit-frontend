export default {


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
            scales: {
                xAxis: {
                    stacked: true,
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    stacked: false,
                    min: -10000,
                    max: 80000,
                    title: {
                        text: 'MW',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' MW';
                        }
                    }
                },
                stackedYAxis: {
                    type: 'linear',
                    stacked: true,
                    position: 'left',
                    /*min: -10000,
                    max: 80000,*/
                    display: false
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


    secondaryEnergyData () {
        let $this = this;
        return {
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return $this.tooltipLabelSuffix(context, ' MW');
                        }
                    }
                }
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
                    }
                }
            }
        }
    },


    weatherOverview () {
        let $this = this;
        return {
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return $this.tooltipLabelSuffix(context, '%');
                        }
                    }
                }
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
                        text: 'Deviation from overall mean',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    },


    clouds () {
        let $this = this;
        return {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return $this.tooltipLabelSuffix(context, '%');
                        }
                    }
                }
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
        let $this = this;
        return {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return $this.tooltipLabelSuffix(context, ' °C');
                        }
                    }
                }
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
                        text: 'Temperature',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '°C';
                        }
                    }
                }
            }
        };
    },


    wind () {
        let $this = this;
        return {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return $this.tooltipLabelSuffix(context, ' m/s');
                        }
                    }
                }
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
        let $this = this;
        return {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return $this.tooltipLabelSuffix(context, ' mm');
                        }
                    }
                }
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
        let $this = this;
        return {
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return $this.tooltipLabelSuffix(context, ' MW');
                        }
                    }
                }
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
                    }
                }
            }
        }
    },


    reversedBorderCrossingData () {
        return this.primaryBorderCrossingData();
    }

}