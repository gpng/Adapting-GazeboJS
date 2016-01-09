#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <limits>

int main()
{
    int i;
    std::string ans = "", joint_temp = "", robot_name_temp = "";
    int ePort = 8124;
    int camera_number = 1;
    std::string camera_name_temp;
    std::vector<std::string> camera_names;
    std::ofstream out("temp.js");
    if (out.is_open())
        std::cout << "temp.txt is open" << std::endl;
    else
    {
        std::cout << "Unable to open temp.txt" << std::endl;
        return -1;
    }

    std::cout << "Port to listen to: ";
    std::cin >> ePort;
    std::cout << "Will listen on port " << ePort << std::endl;
    out << "var http = require(\'http\'), fs = require(\'fs\'), gazebojs = require(\'gazebojs\'), url = require(\'url\');";
    out << "\nvar gazebo = new gazebojs.Gazebo();\noptions = {format:\'jpeg\', enconding:\'binary\'};";
    out << "\nhttp.createServer(function(req,res) {";
    out << "\n\tvar request = url.parse(req.url, true);\n\tvar action = request.pathname\n\tconsole.log(\'Requested\');";
    std::cout << "Number of cameras: ";
    std::cin >> camera_number;
    if (camera_number != 0)
    {
        for (i = 0; i < camera_number; i++)
        {
            std::cout << "Name of camera " << i << " (no spaces): ";
            std::cin >> camera_name_temp;
            camera_names.push_back(camera_name_temp);
            out << "\n\tif (action == \'/image/" << i << "\') {\n\t\tconsole.log(\'Requested image from " << camera_names.at(i) << "\');";
            out << "\n\t\tgazebo.subscribeToImageTopic(\'~/" << camera_names.at(i) << "/link/camera/image\', function(err, img) {";
            out << "\n\t\t\tconsole.log(\'Saving\');\n\t\t\tif (err) {\n\t\t\t\tconsole.log(\'error: \' + err);\n\t\t\t\treturn;\n\t\t\t}";
            out << "\n\t\t\tfs.writeFile(\'image_" << i << ".jpeg\', img, {encoding: \'binary\'}, function (err) {";
            out << "\n\t\t\t\tif (err) console.log(\'ERROR: \' + err); \n\t\t\t\telse console.log('Saved: image_" << i << "\');\n\t\t\t});";
            out << "\n\t\t\tfs.readFile(\'image_" << i << ".jpeg\', function(err, data) {\n\t\t\t\tif (err) console.log(\'ERROR: \' + err);";
            out << "\n\t\t\t\telse {\n\t\t\t\t\tres.writeHead(200, {\'Content-Type\': \'image/jpeg\'});\n\t\t\t\t\tres.end(data);\n\t\t\t\t}\n\t\t\t});";
            out << "\n\t\t\tgazebo.unsubscribe(\'~/" << camera_names.at(i) <<"/link/camera/image\');\n\t\t}, options);\n\t}";
        }
    }
    std::cout << "Add joint command? (y/n): ";
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    std::getline(std::cin, ans);
    while (ans.compare("n") != 0)
    {
        std::cout << "Pathway (ie /move/forward/): ";
        std::getline(std::cin, joint_temp);
        out << "\n\tif (action == \'" << joint_temp << "\') {";
        std::cout << "Console message: ";
        std::getline(std::cin, joint_temp);
        out << "\n\t\tconsole.log(\'" << joint_temp << "\');";
        std::cout << "Name of robot (no spaces): ";
        std::getline(std::cin, robot_name_temp);
        std::cout << "JSON Message: ";
        std::getline(std::cin, joint_temp);
        out << "\n\t\tgazebo.publish(\'gazebo.msgs.JointCmd\',\'/~" << robot_name_temp << "/joint_cmd\', " << joint_temp << ");";
        std::cout<< "Add another message to this joint? (y/n): ";
        std::getline(std::cin, ans);
        while (ans.compare("n") != 0)
        {
            std::cout << "JSON Message: ";
            out << "\n\t\tgazebo.publish(\'gazebo.msgs.JointCmd\',\'/~" << robot_name_temp << "/joint_cmd\', " << joint_temp << ");";
            std::getline(std::cin, joint_temp);
            std::cout<< "Add another message to this joint? (y/n): ";
            std::getline(std::cin, ans);
        }
        out << "\n\t}";
        std::cout << "Add another joint command? (y/n): ";
        std::getline(std::cin, ans);
    }
    out << "\n}).listen(" << ePort << ");\nconsole.log(\'Server running on http://localhost:" << ePort << "/\');";
    out.close();
    return 0;
}
