
/// scripts/supabaseClient.js
// единый клиент Supabase — положи сюда свой anon key (не выкладывай публично)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://xhvuxrifdquyeuffoqju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodnV4cmlmZHF1eWV1ZmZvcWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTY3NDksImV4cCI6MjA3OTY3Mjc0OX0.CFmO_mLGp4cX89lJcs-1CO0RlEXpsTQhy_yVp8XwqXQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

