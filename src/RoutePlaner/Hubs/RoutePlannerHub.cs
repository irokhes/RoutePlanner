using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace RoutePlaner
{
    [HubName("routerplanner")]
    public class RoutePlannerHub : Hub
    {
        public void refreshRoute(dynamic directions)
        {
            Clients.Others.refreshRoutes(directions);
        }
    }
}