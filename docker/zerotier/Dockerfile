FROM zyclonite/zerotier:latest

RUN echo "{\"settings\": {\"portMappingEnabled\": true,\"softwareUpdate\": \"disable\",\"allowManagementFrom\": [\"0.0.0.0/0\"]}}" > /var/lib/zerotier-one/local.conf

EXPOSE 9993/tcp
EXPOSE 9993/udp

ENTRYPOINT ["zerotier-one"]
