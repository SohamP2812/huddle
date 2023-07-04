package com.huddle.core.geoip;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ResourceLoader;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.net.InetAddress;

@Primary
//@Component
public class RealIpLocationProvider implements IpLocationProvider {
    private static final Logger logger = LoggerFactory.getLogger(IpLocationProvider.class);

    private DatabaseReader databaseReader = null;

    @Autowired
    ResourceLoader resourceLoader;

    @PostConstruct
    void init() {
        try {
            InputStream resourceAsStream = resourceLoader
                    .getResource("classpath:/geolite/GeoLite2-City.mmdb")
                    .getInputStream();
            databaseReader = new DatabaseReader.Builder(resourceAsStream)
                    .build();
        } catch (Exception e) {
            logger.error("Unable to create GeoIp database reader", e);
        }
    }

    private IpLocation emptyIpLocation() {
        return new IpLocation("", "", "");
    }

    @Override
    public IpLocation getIpLocation(String ipAddress) {
        if (databaseReader == null) {
            return emptyIpLocation();
        }

        try {
            InetAddress inetIpAddress = InetAddress.getByName(ipAddress);
            CityResponse cityResponse = databaseReader.city(inetIpAddress);
            return new IpLocation(
                    ipAddress,
                    cityResponse.getCity().getName(),
                    cityResponse.getCountry().getName()
            );
        } catch (Exception e) {
            logger.info("Unable to lookup ip: {}", ipAddress);
            return emptyIpLocation();
        }
    }
}