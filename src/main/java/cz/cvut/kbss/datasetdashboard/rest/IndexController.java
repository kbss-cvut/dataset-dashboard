package cz.cvut.kbss.datasetdashboard.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by kremep1 on 30/01/18.
 */
@Controller public class IndexController {
    @RequestMapping(value = {"/namespaces"}) public String index() {
        return "index";
    }
}
