
import React, { useState, useCallback } from 'react';
import { translateText } from './services/translationService';
import { TranslateIcon, LoaderIcon } from './components/icons';

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = useCallback(async () => {
        if (isLoading) return;
        if (!inputText.trim()) {
            setError('Please enter some text to translate.');
            setTranslatedText('');
            return;
        }
        setIsLoading(true);
        setError(null);
        setTranslatedText('');

        try {
            const result = await translateText(inputText);
            setTranslatedText(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to translate. ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [inputText, isLoading]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800">
            <header className="w-full text-center p-4 sm:p-6 bg-white border-b border-slate-200">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">English to Kannada Translator</h1>
                <p className="text-slate-500 mt-1">Powered by Gemini</p>
            </header>

            <main className="flex-grow w-full max-w-5xl mx-auto p-4 flex flex-col">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* English Input */}
                    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-slate-200">
                        <div className="p-3 border-b border-slate-200">
                            <h2 className="font-semibold text-slate-600">English</h2>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter text to translate..."
                            className="w-full h-full flex-grow p-4 bg-transparent resize-none focus:outline-none text-lg"
                            rows={10}
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* Kannada Output */}
                    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-slate-200">
                        <div className="p-3 border-b border-slate-200">
                             <h2 className="font-semibold text-slate-600">Kannada (ಕನ್ನಡ)</h2>
                        </div>
                        <div className="w-full h-full flex-grow p-4 text-lg overflow-y-auto">
                            {isLoading && !translatedText ? (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <LoaderIcon className="w-8 h-8 mr-2" />
                                    <span>Translating...</span>
                                </div>
                            ) : translatedText ? (
                                <p lang="kn">{translatedText}</p>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <p>Translation will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded-md text-center">
                        {error}
                    </div>
                )}
            </main>
            
            <footer className="sticky bottom-0 w-full bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4">
                 <div className="max-w-5xl mx-auto flex justify-center">
                    <button
                        onClick={handleTranslate}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? (
                            <>
                                <LoaderIcon className="w-6 h-6 mr-3" />
                                <span>Translating...</span>
                            </>
                        ) : (
                            <>
                                <TranslateIcon className="w-6 h-6 mr-3" />
                                <span>Translate</span>
                            </>
                        )}
                    </button>
                 </div>
            </footer>
        </div>
    );
};

export default App;
