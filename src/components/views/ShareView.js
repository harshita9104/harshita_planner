import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { 
  Share2, Download, Copy, Calendar, Clock, MapPin, 
  Sparkles, Heart, Star, MessageCircle, Send
} from 'lucide-react';
import * as Icons from 'lucide-react';

const ShareView = ({ themes, selectedTheme, scheduledActivities, generateSummary }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [shareStats, setShareStats] = useState({});
  const cardRef = useRef();

  const ThemeIcon = Icons[themes[selectedTheme]?.icon] || Sparkles;
  const theme = themes[selectedTheme] || themes.mindfulEscape;

  // Calculate weekend statistics
  useEffect(() => {
    const stats = Object.entries(scheduledActivities).reduce((acc, [day, activities]) => {
      acc.totalActivities += activities.length;
      acc.totalDuration += activities.reduce((sum, activity) => sum + activity.duration, 0);
      
      activities.forEach(activity => {
        if (activity.category === 'Outdoor') acc.outdoorActivities++;
        if (activity.energyLevel === 'high') acc.highEnergyActivities++;
        
        if (!acc.categories[activity.category]) acc.categories[activity.category] = 0;
        acc.categories[activity.category]++;
      });
      
      return acc;
    }, {
      totalActivities: 0,
      totalDuration: 0,
      outdoorActivities: 0,
      highEnergyActivities: 0,
      categories: {}
    });

    setShareStats(stats);
  }, [scheduledActivities]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2, // Higher quality
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `weekendly-${selectedTheme}-plan.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const blob = await fetch(dataUrl).then(res => res.blob());
      const file = new File([blob], 'weekend-plan.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Weekend Plan - Weekendly',
          text: generateSummary(),
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = () => {
    const summary = generateSummary();
    const planText = Object.entries(scheduledActivities)
      .map(([day, activities]) => {
        if (activities.length === 0) return '';
        const dayActivities = activities
          .sort((a, b) => a.time.localeCompare(b.time))
          .map(activity => `🕐 ${activity.time} - ${activity.name}`)
          .join('\n');
        return `📅 *${day.toUpperCase()}*:\n${dayActivities}`;
      })
      .filter(Boolean)
      .join('\n\n');

    const fullText = `🎉 ${summary}\n\n${planText}\n\n✨ Planned with Weekendly`;
    const encodedText = encodeURIComponent(fullText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTelegramShare = () => {
    const summary = generateSummary();
    const planText = Object.entries(scheduledActivities)
      .map(([day, activities]) => {
        if (activities.length === 0) return '';
        const dayActivities = activities
          .sort((a, b) => a.time.localeCompare(b.time))
          .map(activity => `⏰ ${activity.time} - ${activity.name}`)
          .join('\n');
        return `📅 **${day.toUpperCase()}**:\n${dayActivities}`;
      })
      .filter(Boolean)
      .join('\n\n');

    const fullText = `🎉 ${summary}\n\n${planText}\n\n✨ Planned with Weekendly`;
    const encodedText = encodeURIComponent(fullText);
    const telegramUrl = `https://t.me/share/url?text=${encodedText}`;
    window.open(telegramUrl, '_blank');
  };

  const copyToClipboard = async () => {
    const summary = generateSummary();
    const planText = Object.entries(scheduledActivities)
      .map(([day, activities]) => {
        if (activities.length === 0) return '';
        const dayActivities = activities
          .sort((a, b) => a.time.localeCompare(b.time))
          .map(activity => `${activity.time} - ${activity.name}`)
          .join('\n');
        return `${day.toUpperCase()}:\n${dayActivities}`;
      })
      .filter(Boolean)
      .join('\n\n');

    const fullText = `${summary}\n\n${planText}\n\nPlanned with Weekendly 🎉`;
    
    try {
      await navigator.clipboard.writeText(fullText);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const totalActivities = Object.values(scheduledActivities).flat().length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in-scale">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-3 rounded-2xl">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Share Your Perfect Weekend
            </h2>
            <p className="text-gray-600 mt-1">Let everyone know about your amazing plans!</p>
          </div>
        </div>
      </div>

      {totalActivities === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-500" />
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">No weekend plan yet</h4>
          <p className="text-gray-600 mb-6">Add some activities to your weekend before sharing!</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <div className="text-2xl font-bold text-gray-900">{shareStats.totalActivities}</div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
            <div className="glass-card p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-gray-900">{Math.floor(shareStats.totalDuration / 60)}</div>
              <div className="text-sm text-gray-600">Hours Planned</div>
            </div>
            <div className="glass-card p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-gray-900">{shareStats.outdoorActivities}</div>
              <div className="text-sm text-gray-600">Outdoor</div>
            </div>
            <div className="glass-card p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold text-gray-900">{shareStats.highEnergyActivities}</div>
              <div className="text-sm text-gray-600">High Energy</div>
            </div>
          </div>

          {/* Shareable Card */}
          <div className="glass-card p-8">
            <div 
              ref={cardRef} 
              className={`bg-gradient-to-br ${theme.color.replace('bg-', '')} rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden`}
              style={{ minHeight: '600px' }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full transform -translate-x-12 translate-y-12" />
              
              {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                  <ThemeIcon className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{theme.name}</h3>
                <p className="text-lg opacity-90 mb-4">{theme.description}</p>
                <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-6 py-3 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">{generateSummary()}</span>
                </div>
              </div>

              {/* Days Grid */}
              <div className="grid gap-6">
                {Object.entries(scheduledActivities).map(([day, activities]) => {
                  if (activities.length === 0) return null;
                  
                  const dayIcons = {
                    monday: Calendar,
                    tuesday: Calendar,
                    wednesday: Calendar,
                    thursday: Calendar,
                    friday: Calendar,
                    saturday: Calendar,
                    sunday: Calendar
                  };
                  
                  const DayIcon = dayIcons[day] || Calendar;
                  
                  return (
                    <div key={day} className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6">
                      <h4 className="font-bold text-xl mb-4 flex items-center space-x-2">
                        <DayIcon className="w-5 h-5" />
                        <span className="capitalize">{day}</span>
                        <span className="text-sm opacity-75">({activities.length} activities)</span>
                      </h4>
                      
                      <div className="grid gap-3">
                        {activities
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((activity, index) => (
                            <div key={activity.id} className="flex items-center justify-between bg-white bg-opacity-10 rounded-xl p-3">
                              <div className="flex items-center space-x-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-semibold">{activity.name}</div>
                                  <div className="text-sm opacity-75">{activity.description}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-bold">{activity.time}</div>
                                <div className="text-xs opacity-75">{activity.duration} min</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-white border-opacity-20">
                <div className="flex items-center justify-center space-x-2 text-sm opacity-90">
                  <Heart className="w-4 h-4" />
                  <span>Planned with Weekendly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Share image button removed as requested - only download and social sharing available */}
            
            <button 
              onClick={handleDownload} 
              disabled={isGenerating}
              className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="loading-spinner" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span>Download</span>
            </button>
            
            <button 
              onClick={copyToClipboard}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                showCopySuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Copy className="w-5 h-5" />
              <span>{showCopySuccess ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {/* Social Media Share Buttons */}
            <button 
              onClick={handleWhatsAppShare}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            
            <button 
              onClick={handleTelegramShare}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </button>

            <button 
              onClick={handleTelegramShare}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200"
            >
              <img src="/telegram-icon.svg" alt="Telegram" className="w-5 h-5" />
              <span>Share on Telegram</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareView;
