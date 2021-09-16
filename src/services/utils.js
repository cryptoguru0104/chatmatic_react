/*eslint no-useless-escape: 0*/

import React from 'react';
import axios from 'axios';
import _, { round } from 'lodash';
import toSnakeCase from 'to-snake-case';
import moment from 'moment';

//Import Settings
import store from '../store';

export const wrapRequest = func => {
    return async (...args) => {
        const res = await func(...args);
        if (res.status !== 200 || res.data.error === 1) {
            throw res.data.error_msg || 'Server Error';
        } else {
            return res;
        }
    };
};

export const xapi = (isMockAPI = true, params = {}) => {
    const token = store.getState().default.auth.apiToken || '';

    return axios.create({
        baseURL: isMockAPI
            ? process.env.REACT_APP_MOCK_API_URL
            : process.env.REACT_APP_API_URL,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
            Authorization: `Token ${token}`
        },
        onUploadProgress: progressEvent => {
            if (
                Object.keys(params).length > 0 &&
                'stepUid' in params &&
                'itemIndex' in params
            ) {
                const totalLength = progressEvent.lengthComputable
                    ? progressEvent.total
                    : typeof progressEvent.target.getResponseHeader ===
                      'function'
                    ? progressEvent.target.getResponseHeader(
                          'content-length'
                      ) ||
                      progressEvent.target.getResponseHeader(
                          'x-decompressed-content-length'
                      )
                    : null;
                if (totalLength !== null) {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / totalLength
                    );
                    window.dispatchEvent(
                        new CustomEvent('fileUpload', {
                            detail: {
                                percent,
                                stepUid: params.stepUid,
                                itemIndex: params.itemIndex
                            }
                        })
                    );
                }
            }
        }
    });
};

export const renderField = ({
    input,
    label,
    type,
    meta: { touched, error }
}) => (
    <div>
        <label>{label}</label>
        <div>
            <input {...input} placeholder={label} type={type} />
            {touched && error && <span>{error}</span>}
        </div>
    </div>
);

export const errorMsg = err => {
    let error = err;
    if (typeof error !== 'string') {
        error = 'Server Error';
    }
    return error;
};

export const convertObjectKeyToCamelCase = obj => {
    let camelCaseObj;

    if (obj instanceof Array) {
        return obj.map(element => {
            let newObj = element;
            if (typeof element === 'object') {
                newObj = convertObjectKeyToCamelCase(element);
            }
            return newObj;
        });
    } else {
        camelCaseObj = {};

        for (const objKey in obj) {
            if (obj.hasOwnProperty(objKey)) {
                const newObjKey = _.camelCase(objKey);
                let keyValue = obj[objKey];

                if (
                    keyValue instanceof Array ||
                    (keyValue !== null && keyValue.constructor === Object)
                ) {
                    keyValue = convertObjectKeyToCamelCase(keyValue);
                }
                camelCaseObj[newObjKey] = keyValue;
            }
        }
    }

    return camelCaseObj;
};

export const snakeCaseKeys = obj => {
    let snake_case_obj;

    if (obj instanceof Array) {
        return obj.map(element => {
            let newObj = element;
            if (typeof element === 'object') {
                newObj = snakeCaseKeys(element);
            }
            return newObj;
        });
    } else {
        snake_case_obj = {};

        for (const objKey in obj) {
            if (obj.hasOwnProperty(objKey)) {
                const newObjKey = toSnakeCase(objKey);
                let keyValue = obj[objKey];

                if (
                    keyValue instanceof Array ||
                    (keyValue !== null && keyValue.constructor === Object)
                ) {
                    keyValue = snakeCaseKeys(keyValue);
                }
                snake_case_obj[newObjKey] = keyValue;
            }
        }
    }
    console.log('ss obj', obj);
    console.log(snake_case_obj);
    return snake_case_obj;
};

export const getSubscriberName = (fname, lname) => {
    let subscriberName = fname || '';

    if (lname) subscriberName += ' ' + lname;

    return subscriberName || 'No Data Provided';
};

export const insertTextAtPos = (originText, textToInsert, currentPos) => {
    const prevOriginText = originText.slice(0, currentPos);
    const nextOriginText = originText.slice(currentPos);

    return [prevOriginText, textToInsert, nextOriginText].join('');
};

export const formatBroadcast = broadcast => {
    if (
        !broadcast ||
        !broadcast.conditions ||
        broadcast.conditions.length === 0
    ) {
        return {
            ...broadcast,
            conditions: [
                { condition: 'send_to_all_subscribers', variable: null }
            ]
        };
    }

    let hasTags = [];
    let hasNotTags = [];
    let campaignsSubscribed = [];
    let campaignsUnSubscribed = [];
    let subscribedDateBefore = [];
    let subscribedDateAfter = [];
    let subscribedDateOn = [];
    let conditions = [];

    broadcast.conditions.forEach(condition => {
        switch (condition.type) {
            case 'hasTag':
                condition.constraint === 'has'
                    ? hasTags.push(condition.value)
                    : hasNotTags.push(condition.value);
                break;
            case 'ifUser':
                condition.constraint === 'subscribed'
                    ? campaignsSubscribed.push(condition.value)
                    : campaignsUnSubscribed.push(condition.value);
                break;
            case 'user_gender':
                conditions.push({
                    condition: condition.type,
                    variable: condition.value
                });
                break;
            case 'subscribed_date':
                const conditionValue = moment(condition.value).format(
                    'YYYY-MM-DD'
                );
                condition.constraint === 'before'
                    ? subscribedDateBefore.push(conditionValue)
                    : condition.constraint === 'after '
                    ? subscribedDateAfter.push(conditionValue)
                    : subscribedDateOn.push(conditionValue);
                break;
            //no default
        }
    });

    if (hasTags.length > 0) {
        conditions.push({
            condition: 'user_tagged_as',
            variable: hasTags
        });
    }
    if (hasNotTags.length > 0) {
        conditions.push({
            condition: 'user_not_tagged_as',
            variable: hasNotTags
        });
    }
    if (campaignsSubscribed.length > 0) {
        conditions.push({
            condition: 'user_subscribed_to_campaign',
            variable: campaignsSubscribed
        });
    }
    if (campaignsUnSubscribed.length > 0) {
        conditions.push({
            condition: 'user_not_subscribed_to_campaign',
            variable: campaignsUnSubscribed
        });
    }
    if (subscribedDateOn.length > 0) {
        conditions.push({
            condition: 'user_subscriber_on_date',
            variable: subscribedDateOn
        });
    }
    if (subscribedDateBefore.length > 0) {
        conditions.push({
            condition: 'user_subscriber_before_date',
            variable: subscribedDateBefore
        });
    }
    if (subscribedDateAfter.length > 0) {
        conditions.push({
            condition: 'user_subscribed_after_date',
            variable: subscribedDateAfter
        });
    }

    return {
        ...broadcast,
        conditions
    };
};

export const parseBroadcasts = broadcasts => {
    return broadcasts
        ? broadcasts.map(broadcast => {
              if (!broadcast.conditions || broadcast.conditions.length === 0)
                  return broadcast;

              let conditions = [];
              broadcast.conditions.forEach(condition => {
                  switch (condition.condition) {
                      case 'user_gender':
                          conditions.push({
                              type: condition.condition,
                              constraint: '',
                              value: condition.variable
                          });
                          break;
                      case 'user_subscribed_to_campaign':
                          condition.variable.forEach(campaignUid => {
                              conditions.push({
                                  type: 'ifUser',
                                  constraint: 'subscribed',
                                  value: campaignUid
                              });
                          });
                          break;
                      case 'user_not_subscribed_to_campaign':
                          condition.variable.forEach(campaignUid => {
                              conditions.push({
                                  type: 'ifUser',
                                  constraint: 'unsubscribed',
                                  value: campaignUid
                              });
                          });
                          break;
                      case 'user_subscribed_after_date':
                          condition.variable.forEach(date => {
                              conditions.push({
                                  type: 'subscribed_date',
                                  constraint: 'after',
                                  value: date
                              });
                          });
                          break;
                      case 'user_subscriber_before_date':
                          condition.variable.forEach(date => {
                              conditions.push({
                                  type: 'subscribed_date',
                                  constraint: 'before',
                                  value: date
                              });
                          });
                          break;
                      case 'user_subscriber_on_date':
                          condition.variable.forEach(date => {
                              conditions.push({
                                  type: 'subscribed_date',
                                  constraint: 'on',
                                  value: date
                              });
                          });
                          break;
                      case 'user_tagged_as':
                          condition.variable.forEach(tagUid => {
                              conditions.push({
                                  type: 'hasTag',
                                  constraint: 'has',
                                  value: tagUid
                              });
                          });
                          break;
                      case 'user_not_tagged_as':
                          condition.variable.forEach(tagUid => {
                              conditions.push({
                                  type: 'hasTag',
                                  constraint: 'hasNot',
                                  value: tagUid
                              });
                          });
                          break;
                  }
              });

              return {
                  ...broadcast,
                  conditions
              };
          })
        : [];
};

const isUrl = url => {
    if (!url) {
        return;
    }

    // check for illegal characters
    if (
        /[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\{\}\*\+\,\;\=\.\-\_\~\%]/i.test(url)
    )
        return;

    // check for hex escapes that aren't complete
    if (/%[^0-9a-f]/i.test(url)) return;
    if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(url)) return;

    let splitted;
    let scheme;
    let authority;
    let path;
    let query;
    let fragment;
    let out = '';

    // from RFC 3986
    splitted = url.match(
        /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
    );
    scheme = splitted[1];
    authority = splitted[2];
    path = splitted[3];
    query = splitted[4];
    fragment = splitted[5];

    // scheme and path are required, though the path can be empty
    if (!(scheme && scheme.length && path.length >= 0)) return;

    // if authority is present, the path must be empty or begin with a /
    if (authority && authority.length) {
        if (!(path.length === 0 || /^\//.test(path))) return;
    } else {
        // if authority is not present, the path must not start with //
        if (/^\/\//.test(path)) return;
    }

    // scheme must begin with a letter, then consist of letters, digits, +, ., or -
    if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase())) return;

    // re-assemble the URL per section 5.3 in RFC 3986
    out += scheme + ':';
    if (authority && authority.length) {
        out += '//' + authority;
    }

    out += path;

    if (query && query.length) {
        out += '?' + query;
    }

    if (fragment && fragment.length) {
        out += '#' + fragment;
    }

    return out;
};

const isHttpUrl = (url, allowHttps) => {
    if (!isUrl(url)) {
        return;
    }
    // from RFC 3986
    let splitted = url.match(
        /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
    );
    let scheme = splitted[1];
    let authority = splitted[2];
    let path = splitted[3];
    let query = splitted[4];
    let fragment = splitted[5];
    let out = '';
    let port;

    if (!scheme) return;

    if (allowHttps) {
        if (scheme.toLowerCase() !== 'https') return;
    } else {
        if (scheme.toLowerCase() !== 'http') return;
    }

    // fully-qualified URIs must have an authority section that is
    // a valid host
    if (!authority) {
        return;
    }

    // enable port component
    if (/:(\d+)$/.test(authority)) {
        port = authority.match(/:(\d+)$/)[0];
        authority = authority.replace(/:\d+$/, '');
    }

    out += scheme + ':';
    out += '//' + authority;

    if (port) {
        out += port;
    }

    out += path;

    if (query && query.length) {
        out += '?' + query;
    }

    if (fragment && fragment.length) {
        out += '#' + fragment;
    }

    return out;
};

const isHttpsUrl = url => {
    return isHttpUrl(url, true);
};

export const isValidUrl = url => {
    return isHttpUrl(url) || isHttpsUrl(url);
};

export const cloneObject = (data = {}) => {
    try {
        return JSON.parse(JSON.stringify(data));
    } catch (ex) {
        return Object.create(null);
    }
};
export const deleteKeys = (data = {}, keys = []) => {
    keys.forEach(key => {
        delete data[key];
    });
    return data;
};
export const parseToArray = input => {
    if (Array.isArray(input)) return input;
    return [];
};
export const shouldBeArray = input => {
    if (!Array.isArray(input)) throw new Error('Items should be of array type');
    return true;
};

export const numberWithCommas = x =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getPerc = (t = 0, v = 0) => {
    return Math.round(((v || 0) / (t || 0)) * 100);
};

export const NumberAlphaRegex = new RegExp(/^[A-Za-z0-9_-]*$/);

export const uniqid = (prefix = 'c', more_entropy = false) => {
    if (typeof prefix === 'undefined') {
        prefix = '';
    }

    var retId;
    var formatSeed = function(seed, reqWidth) {
        seed = parseInt(seed, 10).toString(16); // to hex str
        if (reqWidth < seed.length) {
            // so long we split
            return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) {
            // so short we pad
            return Array(1 + (reqWidth - seed.length)).join('0') + seed;
        }
        return seed;
    };

    // BEGIN REDUNDANT
    let php_js = {};

    // END REDUNDANT
    if (!php_js.uniqidSeed) {
        // init seed with big random int
        php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
    }
    php_js.uniqidSeed++;

    retId = prefix; // start with prefix, add current milliseconds hex string
    retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
    retId += formatSeed(php_js.uniqidSeed, 5); // add seed hex string
    if (more_entropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random() * 10).toFixed(8).toString();
    }

    return retId;
};

export const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = cname => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}