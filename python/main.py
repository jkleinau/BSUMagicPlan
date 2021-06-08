import sys
import xmlParser
from magicXMLImport import import_data, build_data

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    magicXMLdata = ""
    with open(sys.argv[0], 'r') as f:
        for line in f:
            magicXMLdata += line
    data = import_data(data=magicXMLdata)
    rooms = build_data(data)
    xmlParser.write_data_to_xml_schrift(rooms, sys.argv[1])

