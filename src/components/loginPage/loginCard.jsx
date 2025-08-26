
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {Link} from 'react-router-dom';

const Body = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-gray-100 bg-gray-100 py-20">
      <Card className="w-full max-w-2xl p-6 md:p-8 bg-white rounded-2xl shadow-xl border-0 py-5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-teal-700 tracking-tight">
            Welcome to
          </CardTitle>
          <CardTitle className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Tal3a
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <Link to="/login-flow" className="block w-full">
            <Button className="w-full bg-teal-600 text-white text-lg font-semibold py-4 rounded-lg hover:bg-teal-700 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              Sign in with Internet Identity
            </Button>
          </Link>
          <Link to="/login-flow" className="block w-full">
            <Button className="w-full bg-gray-800 text-white text-lg font-semibold py-4 rounded-lg hover:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              Sign in with NFID + Google (Legacy)
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Body;