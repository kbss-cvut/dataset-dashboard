'use strict';

import * as qs from "qs"

const Utils = {
    getJsonLdFirst: function getFirst(r: any[] | undefined | null, prop: string) {
        return ((r && r.length > 0) ? r[0][prop] : null);
    },

    getJsonLdPropertySingleLiteralValue: function (property: string, jsonLd: any) {
        let label = jsonLd[property];
        if (label) {
            if (label.length > 0) {
                label = label[0];
            }
            if (label["@language"]) {
                label = label["@value"] + ' (' + label["@language"] + ')';
            } else if (label["@value"]) {
                label = label["@value"];
            } else if (label["@id"]) {
                label = label["@id"];
            }
        }
        return label;
    },

    /**
     * Creates query parameters as a string. Leading & or ? is not inserted.
     *
     * @param parameters The parameters to add
     * @return parameter string
     */
    createQueryParams: function (parameters: any) {
        return qs.stringify(parameters)
    },

    // calculate a short form of a uri based on namespaces
    getShortForm(namespaces: { [key: string]: string }, uri: string): string {
        if (uri == null) {
            return "";
        } else if (uri.indexOf("#") != -1) {
            const [namespace, id]: string[] = uri.split('#');
            const prefix = namespaces[namespace + '#'] as string;
            if (prefix) {
                return prefix + ':' + id;
            }
        } else if (uri.indexOf("/") != -1) {
            const namespace = uri.substring(0, uri.lastIndexOf('/'))
            const id = uri.substring(uri.lastIndexOf('/') + 1)
            const prefix = namespaces[namespace + '/'];
            if (prefix) {
                return prefix + ':' + id;
            }
        }

        return uri;
    },

    /**
     * Generates min and max year/month combination from a list of observations, each of which has a 'year' and 'month' attribute.
     */
    generateMinMax: function (list:any[]) {

        let minDate = Number.MAX_SAFE_INTEGER;
        let maxDate = Number.MIN_SAFE_INTEGER;

        for (let i in list) {
            const item = list[i];
            const yearmonth = this.getDateInt(item.year, item.month);
            if ((yearmonth < minDate)) {
                minDate = yearmonth
            }

            if ((yearmonth > maxDate)) {
                maxDate = yearmonth
            }
        }
        return {min: minDate, max: maxDate};
    },

    /*
     * Generates the time instants (granularity months) given the minDate-maxDate range. This is needed to leverage recharts with time axis.
     */
    generateMonthTimeAxis: function (minDate: number, maxDate: number) {
        const timeAxis = [];

        for (let i = minDate; i < maxDate + 1; i += 1) {
            if ((i % 100) == 0) {
                i += 1;
                continue;
            }

            if ((i % 100) == 13) {
                i += 87;
                continue;
            }
            timeAxis.push(i)
        }
        return timeAxis
    },

    /*
     * Returns an integer representation of a year/month combination - for recharts time axis support
     */
    getDateInt(year:any, month:any) {
        return (Number(year) * 100 + Number(month))
    },

    /*
     * Returns a string representation of a year/month combination - for recharts time axis support
     */
    getDateString(yearmonth:any) {
        return (Number(yearmonth) % 100) + "/" + (Math.floor(Number(yearmonth) / 100))
    },
    /*
     * Returns a range of integer date instants (granularity months) given number of months back by now.
     */
    getMonthRangeFromNow(monthsBack:number) {
        const today = new Date();
        const maxDate = this.getDateInt(today.getFullYear(), today.getMonth());
        const lastPeriod = new Date();
        lastPeriod.setMonth(lastPeriod.getMonth() - monthsBack);
        const minDate = this.getDateInt(lastPeriod.getFullYear(), lastPeriod.getMonth());
        return {minDate: minDate, maxDate: maxDate}
    },
    /*
     * Returns a list that is the same as its input, but with all duplicates removed.
     */
    unique(xs:any[]) {
        return xs.filter(function (x, i) {
            return xs.indexOf(x) === i
        })
    }

};
export default Utils;
