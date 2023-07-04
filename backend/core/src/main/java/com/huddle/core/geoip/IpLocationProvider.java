package com.huddle.core.geoip;

public interface IpLocationProvider {
    IpLocation getIpLocation(String ipAddress);
}
